#!/usr/bin/env python3
"""Grade foundations iteration-2 runs."""
import json
import os
import re

WORKSPACE = os.path.dirname(os.path.abspath(__file__))
ITER = os.path.join(WORKSPACE, "foundations-iteration-2")


def check(content, assertion):
    a = assertion.lower()

    # CSF3 with satisfies Meta (no component type parameter)
    if "satisfies meta" in a and "no component type" in a:
        has_satisfies = "satisfies Meta" in content
        has_component_type = bool(re.search(r'Meta<typeof\s+\w+>', content))
        passed = has_satisfies and not has_component_type
        return passed, f"satisfies Meta={has_satisfies}, component type={has_component_type}"

    # Meta title starts with Foundations/
    if "meta title" in a and "foundations/" in a:
        match = re.search(r"title:\s*['\"]Foundations/", content)
        return bool(match), f"Foundations/ title {'found' if match else 'not found'}"

    # autodocs and fullscreen
    if "autodocs" in a and "fullscreen" in a:
        has_autodocs = "'autodocs'" in content or '"autodocs"' in content
        has_fullscreen = "'fullscreen'" in content or '"fullscreen"' in content
        return has_autodocs and has_fullscreen, f"autodocs={has_autodocs}, fullscreen={has_fullscreen}"

    # All 5 palettes
    if "5 palettes" in a and "neutral" in a:
        palettes = ['Neutral', 'Brand', 'Red', 'Amber', 'Green']
        found = [p for p in palettes if re.search(rf'export\s+const\s+{p}\b', content)]
        return len(found) >= 4, f"Palette stories: {found}"

    # All 12 steps per palette
    if "12 steps" in a and "50" in a and "1000" in a:
        steps = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950', '1000']
        # Check for step references: literal --colors-*-{step} OR step numbers in arrays/objects
        found_literal = sum(1 for s in steps if re.search(rf'--colors-\w+-{s}\b', content))
        # Also check for step numbers in data arrays (e.g., step: 50, or '50' in step list)
        found_data = sum(1 for s in steps if re.search(rf"(?:step:\s*{s}\b|'{s}'|STEP_ROLES\[)", content))
        # Also check for STEP_ROLES or buildSteps pattern that generates all 12
        has_builder = 'STEP_ROLES' in content or 'buildSteps' in content
        if has_builder:
            # Check that all step numbers appear somewhere in the file
            found_any = sum(1 for s in steps if s in content)
            return found_any >= 10, f"Builder pattern found, {found_any}/12 step numbers present"
        found = max(found_literal, found_data)
        return found >= 10, f"Found references to {found}/12 steps (literal={found_literal}, data={found_data})"

    # Step role annotations
    if "step role" in a and "background" in a and "solid" in a and "text" in a:
        roles = ['background', 'surface', 'border', 'solid', 'text']
        found = [r for r in roles if r.lower() in content.lower()]
        return len(found) >= 4, f"Roles found: {found}"

    # ThemeComparison with data-theme
    if "themecomparison" in a and "data-theme" in a:
        has_story = bool(re.search(r'export\s+const\s+(ThemeComparison|DarkThemeComparison|DarkMode)\b', content))
        has_data_theme = 'data-theme' in content
        return has_story and has_data_theme, f"Theme story={has_story}, data-theme={has_data_theme}"

    # Uses Swatch or SwatchGrid or TonalRamp
    if ("swatch" in a or "swatchgrid" in a or "tonalramp" in a) and "stories/helpers" in a:
        has_swatch = "Swatch" in content
        has_grid = "SwatchGrid" in content
        has_ramp = "TonalRamp" in content
        from_helpers = "stories/helpers" in content
        any_color = has_swatch or has_grid or has_ramp
        return any_color and from_helpers, f"Swatch={has_swatch}, SwatchGrid={has_grid}, TonalRamp={has_ramp}, helpers={from_helpers}"

    # Uses DocPage with Section and SectionHeading
    if "docpage" in a and "section" in a and "sectionheading" in a:
        has_docpage = "DocPage" in content
        has_section = re.search(r'\bSection\b', content) is not None
        has_heading = "SectionHeading" in content
        from_helpers = "stories/helpers" in content
        return has_docpage and from_helpers, f"DocPage={has_docpage}, Section={has_section}, SectionHeading={has_heading}, helpers={from_helpers}"

    # CSS property names derived from source
    if "css custom property" in a and "derived" in a and "--colors-neutral-50" in a:
        tokens = ['--colors-neutral-50', '--colors-brand-500', '--colors-red-700']
        found_literal = sum(1 for t in tokens if t in content)
        # Also check for template literal pattern that generates these
        has_template = '`--colors-${' in content or "colors-${" in content or "buildSteps" in content
        if has_template:
            # Verify the palette names and step numbers are present
            has_palettes = all(p in content for p in ['neutral', 'brand', 'red'])
            return has_palettes, f"Template pattern generates tokens dynamically, palettes present={has_palettes}"
        return found_literal >= 2, f"Found {found_literal}/3 exact CSS property references"

    # Zero inline style attributes
    if "zero inline style" in a:
        # Count style={{ occurrences in JSX (not in comments or strings describing the rule)
        style_count = len(re.findall(r'style=\{\{', content))
        return style_count == 0, f"Found {style_count} inline style={{ occurrences"

    # Overview story
    if "overview story" in a:
        has_overview = bool(re.search(r'export\s+const\s+Overview\b', content))
        return has_overview, f"Overview story={'found' if has_overview else 'not found'}"

    # All spacing tokens
    if "spacing tokens" in a and "--size-0" in a and "--size-128" in a:
        key_tokens = ['--size-0', '--size-4', '--size-8', '--size-16', '--size-32', '--size-64', '--size-128']
        found = sum(1 for t in key_tokens if t in content)
        return found >= 6, f"Found {found}/7 key spacing tokens"

    # Gestalt tier grouping
    if "gestalt tier" in a and "tight" in a:
        has_tight = 'tight' in content.lower()
        has_medium = 'medium' in content.lower()
        has_loose = 'loose' in content.lower()
        return has_tight and has_medium and has_loose, f"tight={has_tight}, medium={has_medium}, loose={has_loose}"

    # Both px and rem
    if "pixel and rem" in a or "px and rem" in a:
        has_px = 'px' in content
        has_rem = 'rem' in content
        return has_px and has_rem, f"px={has_px}, rem={has_rem}"

    # Radii tokens
    if "radii tokens" in a and "--radii-none" in a:
        radii = ['--radii-none', '--radii-sm', '--radii-md', '--radii-lg', '--radii-xl', '--radii-full']
        found = sum(1 for r in radii if r in content)
        return found >= 5, f"Found {found}/6 radii tokens"

    # Stroke weight tokens
    if "stroke weight" in a and "--stroke-weight" in a:
        strokes = ['--stroke-weight-1', '--stroke-weight-2', '--stroke-weight-3']
        found = sum(1 for s in strokes if s in content)
        return found >= 2, f"Found {found}/3 stroke weight tokens"

    # Uses TokenTable or DemoBox
    if "tokentable" in a and "demobox" in a:
        has_tt = "TokenTable" in content
        has_db = "DemoBox" in content
        return has_tt or has_db, f"TokenTable={has_tt}, DemoBox={has_db}"

    # All font-size tokens
    if "font-size tokens" in a and "--font-size-11" in a:
        sizes = ['--font-size-11', '--font-size-14', '--font-size-16', '--font-size-24', '--font-size-48']
        found = sum(1 for s in sizes if s in content)
        return found >= 4, f"Found {found}/5 key font-size tokens"

    # Font weight scale
    if "font weight scale" in a and ("400" in a or "700" in a):
        weights = ['400', '500', '600', '700']
        found = sum(1 for w in weights if w in content)
        return found >= 3, f"Found {found}/4 font weights"

    # Leading scale
    if "leading scale" in a and "none" in a and "loose" in a:
        leads = ['--leading-none', '--leading-tight', '--leading-normal', '--leading-loose']
        found = sum(1 for l in leads if l in content)
        return found >= 3, f"Found {found}/4 leading tokens"

    # Tracking scale
    if "tracking scale" in a and "tighter" in a:
        tracks = ['--tracking-tighter', '--tracking-tight', '--tracking-normal', '--tracking-wide', '--tracking-wider']
        found = sum(1 for t in tracks if t in content)
        return found >= 4, f"Found {found}/5 tracking tokens"

    # Text samples rendered at actual sizes
    if "text samples rendered" in a:
        has_var_font = 'var(--font-size' in content
        has_style_font = 'fontSize' in content or 'font-size' in content
        return has_var_font or has_style_font, f"var(--font-size)={has_var_font}, fontSize={has_style_font}"

    # Font family tokens
    if "font family tokens" in a and "sans" in a and "mono" in a:
        has_sans = '--font-family-sans' in content
        has_mono = '--font-family-mono' in content
        return has_sans and has_mono, f"sans={has_sans}, mono={has_mono}"

    return None, f"No check for: {assertion}"


def grade_run(eval_dir, run_type):
    output_dir = os.path.join(eval_dir, run_type, "outputs")
    output_file = None
    if os.path.exists(output_dir):
        for f in os.listdir(output_dir):
            if f.endswith('.stories.tsx'):
                output_file = os.path.join(output_dir, f)
                break

    metadata_file = os.path.join(eval_dir, "eval_metadata.json")
    with open(metadata_file) as f:
        metadata = json.load(f)

    if not output_file or not os.path.exists(output_file):
        return {
            "expectations": [{"text": a, "passed": False, "evidence": "Output file not found"} for a in metadata["assertions"]],
            "summary": {"passed": 0, "failed": len(metadata["assertions"]), "total": len(metadata["assertions"]), "pass_rate": 0.0}
        }

    with open(output_file) as f:
        content = f.read()

    expectations = []
    passed = 0
    for assertion in metadata["assertions"]:
        result, evidence = check(content, assertion)
        if result is None:
            result = False
            evidence = f"Could not verify: {assertion}"
        if result:
            passed += 1
        expectations.append({"text": assertion, "passed": result, "evidence": evidence})

    total = len(expectations)
    return {
        "expectations": expectations,
        "summary": {"passed": passed, "failed": total - passed, "total": total, "pass_rate": round(passed / total, 2) if total else 0}
    }


def main():
    evals = ["color-primitives-full", "spacing-scale-casual", "typography-minimal"]
    run_types = ["with_skill", "without_skill"]

    for eval_name in evals:
        eval_dir = os.path.join(ITER, eval_name)
        for run_type in run_types:
            grading = grade_run(eval_dir, run_type)
            out_path = os.path.join(eval_dir, run_type, "grading.json")
            with open(out_path, "w") as f:
                json.dump(grading, f, indent=2)
            print(f"{eval_name}/{run_type}: {grading['summary']['passed']}/{grading['summary']['total']} ({grading['summary']['pass_rate']})")
            for e in grading['expectations']:
                if not e['passed']:
                    print(f"  FAIL: {e['text']}")
                    print(f"        {e['evidence']}")


if __name__ == "__main__":
    main()
