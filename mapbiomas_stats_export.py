# -*- coding: utf-8 -*-
"""
mapbiomas_stats_export.py
=========================

Extract the annual MapBiomas Paraguay (Collection 2) statistics from the
official COVERAGE sheet and regenerate the two derived CSV files used by the
article figures:

  - data/mapbiomas_woody_anual.csv      (territory, year, woody_ha)
  - data/mapbiomas_antropico_anual.csv  (territory, year, pasture_ha,
                                         agriculture_ha, plantation_ha, total_ha)

The source workbook is NOT versioned in this repository. Download the official
file from:

    https://paraguay.mapbiomas.org/wp-content/uploads/sites/11/2026/09/Statistics-Paraguay-Col2-V1.xlsx

and pass it with ``--xlsx``. If omitted, the script looks for
``Statistics-Paraguay-Col2-V1.xlsx`` next to this script.

Usage:
    python mapbiomas_stats_export.py --xlsx <path> [--out-dir data]

The script sums raw hectare floats per territory-year, rounds the final summed
values to integers, writes the CSVs (UTF-8, ``\\n`` newlines) and then
self-verifies a set of anchors, exiting non-zero if any computed value differs
from the documented expectation by more than +/-1 ha.
"""

import argparse
import csv
import os
import sys

import openpyxl

SHEET_NAME = "COVERAGE"

# Column names in the COVERAGE sheet (all by name, never by position).
COL_TERRITORY_1 = "territory_level_1"
COL_TERRITORY_2 = "territory_level_2"
COL_TERRITORY_3 = "territory_level_3"
COL_CATEGORY = "category"
COL_CLASS_1 = "class_level_1"
COL_CLASS_2 = "class_level_2"

YEAR_MIN = 1985
YEAR_MAX = 2023
YEARS = list(range(YEAR_MIN, YEAR_MAX + 1))
YEAR_COLUMNS = {year: "y{}".format(year) for year in YEARS}

# Category values kept for the political aggregation.
POLITICAL_CATEGORIES = {
    "POLITICAL_LEVEL_1",
    "POLITICAL_LEVEL_2",
    "POLITICAL_LEVEL_3",
}

# Level-1 / level-2 legend classes used for the two indicators.
WOODY_CLASS_1 = "1. Woody Natural Vegetation"
ANTHROPIC_CLASS_1 = "3. Agricultural Areas"

# Anthropic sub-classes (class_level_2) mapped to output column names.
ANTHROPIC_SUBCLASSES = {
    "3.1 Pasture": "pasture_ha",
    "3.2 Agriculture": "agriculture_ha",
    "3.3 Forest Plantation": "plantation_ha",
}

# Territories in output order. Each entry is (output label, required values).
# The category filter is required to keep the three political levels apart:
# every political row shares territory_level_1 == "Paraguay", so the category
# is what disambiguates L1 (country), L2 (regions) and L3 (departments).
TERRITORIES = [
    ("Paraguay", {
        COL_CATEGORY: "POLITICAL_LEVEL_1",
        COL_TERRITORY_1: "Paraguay",
    }),
    ("Region Occidental", {
        COL_CATEGORY: "POLITICAL_LEVEL_2",
        COL_TERRITORY_2: "REGION OCCIDENTAL",
    }),
    ("Region Oriental", {
        COL_CATEGORY: "POLITICAL_LEVEL_2",
        COL_TERRITORY_2: "REGION ORIENTAL",
    }),
    ("Boqueron", {
        COL_CATEGORY: "POLITICAL_LEVEL_3",
        COL_TERRITORY_2: "Region Occidental",
        COL_TERRITORY_3: "BOQUER\u00d3N",
    }),
    ("Alto Paraguay", {
        COL_CATEGORY: "POLITICAL_LEVEL_3",
        COL_TERRITORY_2: "Region Occidental",
        COL_TERRITORY_3: "ALTO PARAGUAY",
    }),
    ("Presidente Hayes", {
        COL_CATEGORY: "POLITICAL_LEVEL_3",
        COL_TERRITORY_2: "Region Occidental",
        COL_TERRITORY_3: "PRESIDENTE HAYES",
    }),
]

# Anchors expected from the official workbook. Kept next to the code so the
# script fails loudly if a future source revision or a bug changes the numbers.
EXPECTED_WOODY = {
    "Region Occidental": {1985: 23096820, 2000: 22129861, 2023: 17438907},
    "Region Oriental": {1985: 6469596, 2000: 4605414, 2023: 3436799},
    "Paraguay": {1985: 29566415, 2000: 26735274, 2023: 20875705},
    "Boqueron": {1985: 8362836, 2000: 7894920, 2023: 5221734},
    "Alto Paraguay": {1985: 7780139, 2000: 7579557, 2023: 6042262},
    "Presidente Hayes": {1985: 6953383, 2000: 6654923, 2023: 6174450},
}

EXPECTED_ANTHROPIC = {
    "Region Occidental": {
        1985: {"total_ha": 758911, "pasture_ha": 748847, "agriculture_ha": 10064},
        2023: {"total_ha": 6384138, "pasture_ha": 5839409, "agriculture_ha": 544729},
    },
}

ANCHOR_TOLERANCE_HA = 1

DEFAULT_XLSX = os.path.join(
    os.path.dirname(os.path.abspath(__file__)),
    "Statistics-Paraguay-Col2-V1.xlsx",
)
WOODY_CSV = "mapbiomas_woody_anual.csv"
ANTHROPIC_CSV = "mapbiomas_antropico_anual.csv"


def _strip(value):
    """Strip whitespace from label strings, leaving other types untouched."""
    return value.strip() if isinstance(value, str) else value


def _to_float(value):
    """Coerce a spreadsheet cell to float, treating None/blank as 0.0."""
    if value is None or (isinstance(value, str) and not value.strip()):
        return 0.0
    return float(value)


def read_political_rows(xlsx_path):
    """Read COVERAGE and return the political rows as normalized dicts.

    Each returned dict maps column name -> value, with label columns
    whitespace-stripped and year columns coerced to floats.
    """
    workbook = openpyxl.load_workbook(xlsx_path, read_only=True, data_only=True)
    try:
        sheet = workbook[SHEET_NAME]
        rows_iter = sheet.iter_rows(values_only=True)
        header = next(rows_iter)
        index_by_name = {name: i for i, name in enumerate(header)}

        missing = [
            name for name in (
                COL_TERRITORY_1, COL_TERRITORY_2, COL_TERRITORY_3,
                COL_CATEGORY, COL_CLASS_1, COL_CLASS_2,
            )
            if name not in index_by_name
        ]
        missing += [col for col in YEAR_COLUMNS.values() if col not in index_by_name]
        if missing:
            raise ValueError(
                "COVERAGE sheet is missing expected columns: {}".format(
                    ", ".join(missing)
                )
            )

        label_columns = (
            COL_TERRITORY_1, COL_TERRITORY_2, COL_TERRITORY_3,
            COL_CATEGORY, COL_CLASS_1, COL_CLASS_2,
        )

        political_rows = []
        for row in rows_iter:
            category = _strip(row[index_by_name[COL_CATEGORY]])
            if category not in POLITICAL_CATEGORIES:
                continue

            record = {name: _strip(row[index_by_name[name]]) for name in label_columns}
            for year, column_name in YEAR_COLUMNS.items():
                record[year] = _to_float(row[index_by_name[column_name]])
            political_rows.append(record)

        return political_rows
    finally:
        workbook.close()


def _matches(record, required):
    """True when every required column equals the record's stripped value."""
    return all(record.get(name) == value for name, value in required.items())


def aggregate(rows, required, indicator_class_1):
    """Sum the year columns over matching rows (raw floats, not rounded)."""
    totals = {year: 0.0 for year in YEARS}
    for record in rows:
        if not _matches(record, required):
            continue
        if record[COL_CLASS_1] != indicator_class_1:
            continue
        for year in YEARS:
            totals[year] += record[year]
    return totals


def build_datasets(xlsx_path):
    """Return (woody, anthropic) tables keyed by territory label.

    woody[label][year] -> int hectares
    anthropic[label][year] -> {"pasture_ha", "agriculture_ha",
                               "plantation_ha", "total_ha"} as ints
    """
    rows = read_political_rows(xlsx_path)

    woody = {}
    anthropic = {}

    for label, required in TERRITORIES:
        woody_totals = aggregate(rows, required, WOODY_CLASS_1)
        woody[label] = {year: round(total) for year, total in woody_totals.items()}

        # Sum raw floats per anthropic sub-class, then round the final sums.
        subclass_totals = {
            column: {year: 0.0 for year in YEARS}
            for column in ANTHROPIC_SUBCLASSES.values()
        }
        grand_totals = {year: 0.0 for year in YEARS}
        for record in rows:
            if not _matches(record, required):
                continue
            if record[COL_CLASS_1] != ANTHROPIC_CLASS_1:
                continue
            column = ANTHROPIC_SUBCLASSES.get(record[COL_CLASS_2])
            for year in YEARS:
                grand_totals[year] += record[year]
                if column is not None:
                    subclass_totals[column][year] += record[year]

        anthropic[label] = {}
        for year in YEARS:
            anthropic[label][year] = {
                "pasture_ha": round(subclass_totals["pasture_ha"][year]),
                "agriculture_ha": round(subclass_totals["agriculture_ha"][year]),
                "plantation_ha": round(subclass_totals["plantation_ha"][year]),
                "total_ha": round(grand_totals[year]),
            }

    return woody, anthropic


def write_csv(path, header, data_rows):
    """Write a CSV as UTF-8 with comma separators and ``\\n`` newlines."""
    with open(path, "w", encoding="utf-8", newline="") as handle:
        writer = csv.writer(handle, lineterminator="\n")
        writer.writerow(header)
        writer.writerows(data_rows)


def write_outputs(out_dir, woody, anthropic):
    """Write both CSV files and return their paths."""
    os.makedirs(out_dir, exist_ok=True)

    woody_path = os.path.join(out_dir, WOODY_CSV)
    woody_rows = []
    for label, _ in TERRITORIES:
        for year in YEARS:
            woody_rows.append([label, year, woody[label][year]])
    write_csv(woody_path, ["territory", "year", "woody_ha"], woody_rows)

    anthropic_path = os.path.join(out_dir, ANTHROPIC_CSV)
    anthropic_rows = []
    for label, _ in TERRITORIES:
        for year in YEARS:
            values = anthropic[label][year]
            anthropic_rows.append([
                label, year,
                values["pasture_ha"],
                values["agriculture_ha"],
                values["plantation_ha"],
                values["total_ha"],
            ])
    write_csv(
        anthropic_path,
        ["territory", "year", "pasture_ha", "agriculture_ha",
         "plantation_ha", "total_ha"],
        anthropic_rows,
    )

    return woody_path, anthropic_path


def verify_anchors(woody, anthropic):
    """Compare computed anchors against the expected values.

    Prints a comparison table and returns True when every anchor is within
    +/-ANCHOR_TOLERANCE_HA of the expectation.
    """
    failures = []

    print("\nAnchor check - woody_ha (computed vs expected):")
    for label, years in EXPECTED_WOODY.items():
        for year, expected in sorted(years.items()):
            computed = woody[label][year]
            diff = computed - expected
            status = "OK" if abs(diff) <= ANCHOR_TOLERANCE_HA else "FAIL"
            if status == "FAIL":
                failures.append(
                    "woody[{!r}][{}]: computed {} vs expected {} (diff {:+d})".format(
                        label, year, computed, expected, diff
                    )
                )
            print(
                "  {:<20} {:>4}  computed {:>12,}  expected {:>12,}  "
                "diff {:>+4d}  {}".format(label, year, computed, expected, diff, status)
            )

    print("\nAnchor check - anthropic (Region Occidental):")
    for label, years in EXPECTED_ANTHROPIC.items():
        for year, metrics in sorted(years.items()):
            for metric, expected in sorted(metrics.items()):
                computed = anthropic[label][year][metric]
                diff = computed - expected
                status = "OK" if abs(diff) <= ANCHOR_TOLERANCE_HA else "FAIL"
                if status == "FAIL":
                    failures.append(
                        "anthropic[{!r}][{}].{}: computed {} vs expected {} "
                        "(diff {:+d})".format(
                            label, year, metric, computed, expected, diff
                        )
                    )
                print(
                    "  {:<20} {:>4}  {:<15} computed {:>12,}  "
                    "expected {:>12,}  diff {:>+4d}  {}".format(
                        label, year, metric, computed, expected, diff, status
                    )
                )

    if failures:
        print("\nAnchor verification FAILED:")
        for failure in failures:
            print("  - {}".format(failure))
        return False

    print("\nAll anchors within +/-{} ha. OK.".format(ANCHOR_TOLERANCE_HA))
    return True


def main(argv=None):
    parser = argparse.ArgumentParser(
        description=(
            "Regenerate the annual MapBiomas Paraguay CSVs from the official "
            "Statistics workbook."
        )
    )
    parser.add_argument(
        "--xlsx",
        default=DEFAULT_XLSX,
        help=(
            "Path to Statistics-Paraguay-Col2-V1.xlsx "
            "(default: next to this script)."
        ),
    )
    parser.add_argument(
        "--out-dir",
        default="data",
        help="Output directory for the CSV files (default: data).",
    )
    args = parser.parse_args(argv)

    if not os.path.isfile(args.xlsx):
        parser.error("workbook not found: {}".format(args.xlsx))

    print("Reading workbook: {}".format(args.xlsx))
    woody, anthropic = build_datasets(args.xlsx)

    woody_path, anthropic_path = write_outputs(args.out_dir, woody, anthropic)
    print("Wrote: {}".format(woody_path))
    print("Wrote: {}".format(anthropic_path))

    anchors_ok = verify_anchors(woody, anthropic)
    return 0 if anchors_ok else 1


if __name__ == "__main__":
    sys.exit(main())
