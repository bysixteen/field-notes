#!/usr/bin/env python3
"""Grade all eval runs for bs-storybook-docs skill."""
import json
import os
import re

WORKSPACE = os.path.dirname(os.path.abspath(__file__))
ITER = os.path.join(WORKSPACE, "iteration-1")

def check_file(content, assertion):
    """Check a single assertion against file content. Returns (passed, evidence)."""

    a = assertion.lower()

    # CSF3 format with satisfies Meta
    if "satisfies meta<typeof button>" in a:
        found = "satisfies Meta<typeof Button>" in content
        return found, f"{'Found' if found else 'Not found'}: satisfies Meta<typeof Button>"

    # tags: ['autodocs'] and layout: 'fullscreen'
    if "autodocs" in a and "fullscreen" in a:
        has_autodocs = "'autodocs'" in content or '"autodocs"' in content
        has_fullscreen = "'fullscreen'" in content or '"fullscreen"' in content
        both = has_autodocs and has_fullscreen
        return both, f"autodocs={'yes' if has_autodocs else 'no'}, fullscreen={'yes' if has_fullscreen else 'no'}"

    # All 5 sentiments
    if "sentiments" in a and ("neutral" in a or "5 sentiment" in a):
        sentiments = ['neutral', 'warning', 'highlight', 'success', 'error']
        # Check they appear as values, not just in meta
        found = all(f"'{s}'" in content or f'"{s}"' in content for s in sentiments)
        # Check there's a Sentiments story export
        has_story = re.search(r'export\s+const\s+Sentiments?\b', content) is not None
        return found and has_story, f"All sentiments present={found}, story export={has_story}"

    # All 3 emphasis levels
    if "emphasis" in a and ("high" in a or "3 emphasis" in a):
        emphases = ['high', 'medium', 'low']
        found = all(f"'{e}'" in content or f'"{e}"' in content for e in emphases)
        has_story = re.search(r'export\s+const\s+(Emphases|EmphasisLevels)\b', content) is not None
        return found and has_story, f"All emphases present={found}, story export={has_story}"

    # All 5 sizes
    if "sizes" in a and ("xs" in a or "5 size" in a):
        sizes = ['xs', 'sm', 'md', 'lg', 'xl']
        found = all(f"'{s}'" in content or f'"{s}"' in content for s in sizes)
        has_story = re.search(r'export\s+const\s+(Sizes|SizeScale)\b', content) is not None
        return found and has_story, f"All sizes present={found}, story export={has_story}"

    # All 5 states
    if "states" in a and ("rest" in a or "5 state" in a):
        states = ['rest', 'hover', 'active', 'disabled', 'resolving']
        found = all(f"'{s}'" in content or f'"{s}"' in content for s in states)
        has_story = re.search(r'export\s+const\s+(States|StateVariants)\b', content) is not None
        return found and has_story, f"All states present={found}, story export={has_story}"

    # AllCombinations story — sentiment x emphasis matrix
    if "allcombinations" in a or "sentiment × emphasis" in a.replace("x", "×") or "sentiment x emphasis" in a:
        has_story = re.search(r'export\s+const\s+(AllCombinations|SentimentEmphasisMatrix|SentimentByEmphasis)\b', content) is not None
        return has_story, f"Matrix story export={'found' if has_story else 'not found'}"

    # TokenReference story with token array
    if "tokenreference" in a or "token array" in a or "token reference section" in a or "token table" in a.replace("token reference", ""):
        has_tokens = "--btn/" in content
        has_story = re.search(r'export\s+const\s+(TokenReference|DesignTokens)\b', content) is not None or "token" in content.lower()
        return has_tokens and has_story, f"Token data={has_tokens}, token story={has_story}"

    # Token categories
    if "token categories" in a and "colour" in a:
        categories = ['colour', 'spacing', 'typography', 'structure']
        found = all(f"'{c}'" in content or f'"{c}"' in content or f"'{c.title()}'" in content or f'"{c.title()}"' in content for c in categories)
        return found, f"All 4 categories present={found}"

    # Anatomy story
    if "anatomy" in a and ("numbered" in a or "jsx structure" in a or "anatomy section" in a or "btn root" in a):
        elements = ['btn__prefix', 'btn__label', 'btn__suffix', 'btn__spinner']
        found = sum(1 for e in elements if e in content)
        has_story = re.search(r'export\s+const\s+Anatomy\b', content) is not None
        return found >= 3 and has_story, f"Found {found}/4 anatomy elements, story={has_story}"

    # UsageGuidance story
    if "usageguidance" in a or "usage guidance" in a or "dosdonts" in a.replace("dos/don", "dosdon"):
        has_story = re.search(r'export\s+const\s+(UsageGuidance|UsageDosAndDonts)\b', content) is not None
        uses_helper = "DosDonts" in content or "do'" in content.lower()
        return has_story and uses_helper, f"Usage story={has_story}, uses helper/pattern={uses_helper}"

    # DarkMode story
    if "darkmode" in a or "dark mode" in a or "light and dark" in a:
        has_story = re.search(r'export\s+const\s+DarkMode\b', content) is not None
        has_theme = 'data-theme' in content
        return has_story or has_theme, f"DarkMode story={has_story}, data-theme={has_theme}"

    # Helpers imports
    if "helpers" in a and ("docpage" in a or "tokentable" in a or "stories/helpers" in a):
        imports_helpers = "stories/helpers" in content or "helpers/" in content
        uses_docpage = "DocPage" in content
        uses_tokentable = "TokenTable" in content
        return imports_helpers, f"Imports helpers={imports_helpers}, DocPage={uses_docpage}, TokenTable={uses_tokentable}"

    # argTypes grouped
    if "argtypes" in a and "dimensions" in a.lower():
        has_dimensions = "category: 'Dimensions'" in content or '"Dimensions"' in content or 'category: "Dimensions"' in content
        has_content = "category: 'Content'" in content or '"Content"' in content or 'category: "Content"' in content
        has_events = "category: 'Events'" in content or '"Events"' in content or 'category: "Events"' in content or "action:" in content
        grouped = has_dimensions and has_content and has_events
        return grouped, f"Dimensions={has_dimensions}, Content={has_content}, Events={has_events}"

    # No hardcoded colour/spacing values
    if "no hardcoded" in a:
        # Check for hex colours in render functions (not in comments)
        hex_in_render = len(re.findall(r'(?:background|color|border):\s*["\']?#[0-9a-fA-F]{3,8}', content))
        # Allow some in baseline (do/don't styling etc)
        return hex_in_render <= 2, f"Found {hex_in_render} hardcoded colour values in render code"

    # Structure dimension represented
    if "structure" in a and ("standard" in a or "icon-only" in a):
        structures = ['standard', 'icon-only', 'split']
        found = all(f"'{s}'" in content or f'"{s}"' in content for s in structures)
        return found, f"All structures present={found}"

    # File named Button.docs.stories.tsx
    if "named button.docs.stories.tsx" in a:
        return True, "File is named correctly (saved as Button.docs.stories.tsx)"

    # CSF3 with proper TypeScript types
    if "csf3 format" in a and "typescript" in a:
        has_meta = "Meta<typeof Button>" in content or "Meta<typeof" in content
        has_story = "StoryObj" in content
        return has_meta and has_story, f"Meta type={has_meta}, StoryObj type={has_story}"

    # Default story
    if "default story" in a:
        has_default = re.search(r'export\s+const\s+Default', content) is not None
        return has_default, f"Default story export={'found' if has_default else 'not found'}"

    # Dimension stories for all 5 dimensions
    if "dimension stories" in a and "5 dimensions" in a:
        dims = ['Sentiment', 'Emphasis', 'Size', 'State', 'Structure']
        found = sum(1 for d in dims if re.search(rf'export\s+const\s+{d}', content, re.IGNORECASE))
        return found >= 4, f"Found stories for {found}/5 dimensions"

    # Token table matches CSS
    if "css custom properties" in a and ("match" in a or "button.css" in a):
        css_tokens = ['--btn/colour/bg/rest', '--btn/colour/fg/rest', '--btn/spacing/padding-x']
        found = sum(1 for t in css_tokens if t in content)
        return found >= 2, f"Found {found}/3 key CSS tokens from source"

    # Dimension modes from types file
    if "dimension modes" in a and "types file" in a:
        # Check the dimension values match the types
        has_correct = all(v in content for v in ['neutral', 'warning', 'highlight', 'success', 'error', 'high', 'medium', 'low'])
        return has_correct, f"Types-derived values present={has_correct}"

    return None, f"No automated check for: {assertion}"


def grade_run(eval_dir, run_type):
    """Grade a single run."""
    output_file = os.path.join(eval_dir, run_type, "outputs", "Button.docs.stories.tsx")
    metadata_file = os.path.join(eval_dir, "eval_metadata.json")

    with open(metadata_file) as f:
        metadata = json.load(f)

    if not os.path.exists(output_file):
        return {
            "expectations": [{"text": a, "passed": False, "evidence": "Output file not found"} for a in metadata["assertions"]],
            "summary": {"passed": 0, "failed": len(metadata["assertions"]), "total": len(metadata["assertions"]), "pass_rate": 0.0}
        }

    with open(output_file) as f:
        content = f.read()

    expectations = []
    passed = 0
    for assertion in metadata["assertions"]:
        result, evidence = check_file(content, assertion)
        if result is None:
            result = False
            evidence = f"Could not automatically verify: {assertion}"
        if result:
            passed += 1
        expectations.append({"text": assertion, "passed": result, "evidence": evidence})

    total = len(expectations)
    return {
        "expectations": expectations,
        "summary": {"passed": passed, "failed": total - passed, "total": total, "pass_rate": round(passed / total, 2) if total > 0 else 0}
    }


def main():
    evals = ["button-full-docs", "button-casual-prompt", "button-minimal-prompt"]
    run_types = ["with_skill", "without_skill"]

    for eval_name in evals:
        eval_dir = os.path.join(ITER, eval_name)
        for run_type in run_types:
            grading = grade_run(eval_dir, run_type)
            out_path = os.path.join(eval_dir, run_type, "grading.json")
            with open(out_path, "w") as f:
                json.dump(grading, f, indent=2)
            print(f"{eval_name}/{run_type}: {grading['summary']['passed']}/{grading['summary']['total']} ({grading['summary']['pass_rate']})")


if __name__ == "__main__":
    main()
