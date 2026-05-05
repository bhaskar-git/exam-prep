#!/usr/bin/env python3
"""
Hackathon Helper Application
Guides you through the 10‑day AI hackathon process described in Context.txt.

Features:
1. Idea brainstorming & problem framing
2. Checklist tracking for mandatory submission items
3. Template generation:
   - Problem statement & solution doc
   - Google Form answers
   - LinkedIn post
4. Progress progress tracking
5. Simple project timer (optional)
"""

import os
import datetime
import json
import sys
from pathlib import Path

# ----------------------- Configuration -----------------------
CHECKLIST_FILE = "hackathon_checklist.json"
TEMPLATE_DIR = "templates"
os.makedirs(TEMPLATE_DIR, exist_ok=True)

# ----------------------- Helper Functions -----------------------
def load_checklist():
    if os.path.exists(CHECKLIST_FILE):
        with open(CHECKLIST_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    # Default empty checklist
    checklist = {
        "submission_folder": "",
        "problem_doc": "",
        "google_form": "",
        "linkedin_post": "",
        "video_recorded": False,
        "completed": 0,
        "total": 7
    }
    save_checklist(checklist)
    return checklist

def save_checklist(cl):
    with open(CHECKLIST_FILE, "w", encoding="utf-8") as f:
        json.dump(cl, f, indent=2)

def mark_completed():
    checklist = load_checklist()
    completed = checklist.get("completed", 0)
    checklist["completed"] = completed + 1
    checklist["total"] = 7  # keep sync
    save_checklist(checklist)
    return checklist["completed"], checklist["total"]

def get_progress_bar(completed, total):
    ratio = completed / total
    filled = int(ratio * 10)
    bar = "▮" * filled + "▯" * (10 - filled)
    return f"[{bar}] {completed}/{total}"

# ----------------------- Core Logic -----------------------
def setup_submission_folder():
    """Create the required Drive folder structure."""
    print("\n=== STEP 1: Set Up Submission Folder ===")
    name = input("Enter a name for your project folder: ").strip()
    if not name:
        print("Folder name cannot be empty.")
        return

    # Build path like: Hackathon Submission / {name}
    parent = "Hackathon Submission"
    proj_folder = os.path.join(parent, name)

    try:
        os.makedirs(proj_folder, exist_ok=True)
        # Sub-folders per spec
        for sub in ["1_Problem_Statement", "2_Solution_Doc", "3_Recordings", "4_Final"]:
            os.makedirs(os.path.join(proj_folder, sub), exist_ok=True)

        # Create placeholder files
        for sub in ["1_Problem_Statement", "2_Solution_Doc"]:
            fname = os.path.join(proj_folder, sub, "README.md")
            if not os.path.isfile(fname):
                with open(fname, "w", encoding="utf-8") as f:
                    f.write(f"# {name}\n\n## Content will go here.\n")

        print(f"Created folder structure: {proj_folder}")
        print("Next: Share this folder with product@houseofedtech.in as Editor and set " +
              "\"Anyone with the link · Viewer\" access.")
        # Record in checklist
        checklist = load_checklist()
        checklist["submission_folder"] = proj_folder
        save_checklist(checklist)
    except Exception as e:
        print(f"Error creating folder: {e}")

def generate_problem_solution_doc():
    """Create the problem-statement-and-solution document."""
    print("\n=== STEP 2: Generate Problem & Solution Document ===")
    checklist = load_checklist()
    folder = checklist.get("submission_folder")
    if not folder:
        print("Please set up the submission folder first.")
        return

    doc_path = os.path.join(folder, "1_Problem_Statement", "Problem_and_Solution.md")
    print(f"Creating document at {doc_path}")
    with open(doc_path, "w", encoding="utf-8") as f:
        f.write("# Problem Statement\n\n")
        f.write("## 1. Real‑World Problem\n")
        f.write("- **User**: \n")
        f.write("- **Impact**: (e.g., saves X hours/week)\n")
        f.write("\n## 2. Why AI?\n")
        f.write("- Explain why a simple rule‑based solution would not suffice.\n")
        f.write("\n## 3. Solution Overview\n")
        f.write("- **Core AI Step**: (e.g., input → AI model → output)\n")
        f.write("- **Key Benefits**: time saved, accuracy gain, etc.\n")
    print(f"Document created. Edit it with your details.")

    # Mark checklist item as done
    checklist["problem_doc"] = doc_path
    save_checklist(checklist)
    mark_completed()
    print("✓ Problem‑statement document checklist item recorded.")
    return doc_path

def prepare_google_form_answers():
    """Generate a template for the Google Form answers."""
    print("\n=== STEP 3: Prepare Google Form Answers ===")
    checklist = load_checklist()
    if not checklist.get("submission_folder"):
        print("Set up submission folder first.")
        return

    # Gather concise answers
    user = input("Enter the user type (e.g., freelance designer, researcher, etc.): ").strip()
    impact = input("Estimate the effort saved per instance (e.g., 5 hours/week): ").strip()
    problem_desc = input("Briefly describe the problem in one sentence: ").strip()
    solution_desc = input("One‑sentence description of your AI solution: ").strip()
    ai_model = input("Name the AI model you will use (e.g., Claude‑Opus‑4‑7): ").strip()

    answers = {
        "Problem": problem_desc,
        "User": user,
        "TimeSaved": impact,
        "AI": ai_model,
        "Solution": solution_desc
    }

    # Save template
    form_path = os.path.join(folder, "3_Recordings", "Google_Form_Template.txt")
    with open(form_path, "w", encoding="utf-8") as f:
        f.write("=== Google Form Answers (under 100 words each) ===\n")
        for k, v in answers.items():
            f.write(f"{k}: {v}\n")
    print(f"Template saved to {form_path}")

    # Record in checklist
    checklist["google_form"] = form_path
    save_checklist(checklist)
    mark_completed()
    print("✓ Google Form answer checklist item recorded.")
    return form_path

def draft_linkedin_post():
    """Generate a LinkedIn post template."""
    print("\n=== STEP 4: Draft LinkedIn Post ===")
    checklist = load_checklist()
    if not checklist.get("submission_folder"):
        print("Set up submission folder first.")
        return

    project_name = input("Project name (as appears in folder): ").strip()
    description = input("One‑sentence summary of your project: ").strip()
    impact = input("Key impact (e.g., 'cuts data‑entry time by 80%'): ").strip()
    model = input("Which AI model did you use? ").strip()
    link = input("Path or placeholder for the Drive folder (e.g., <drive‑link>): ").strip()

    post = f"""🚀 Just wrapped up a hackathon build! 🚀

I tackled **{problem_desc}** – a pain point {user} face daily. My solution uses **{model}** to {impact}.

✨ What’s unique? The AI step is load‑bearing – without it the workflow collapses.

You can explore the full project here: {link}

#AI #Hackathon #MachineLearning #Innovation"""

    path = os.path.join(folder, "4_Final", "LinkedIn_Post.txt")
    with open(path, "w", encoding="utf-8") as f:
        f.write(post)
    print(f"LinkedIn post template saved to {path}")

    checklist["linkedin_post"] = path
    save_checklist(checklist)
    mark_completed()
    print("✓ LinkedIn post checklist item recorded.")

def video_recording_reminder():
    """Prompt to record demo video and mark checklist."""
    print("\n=== STEP 5: Video Recording ===")
    print("Make sure you record a 5‑10 minute demo showing:")
    print("- Problem explanation")
    print("- AI step in action")
    print("- End‑to‑end flow")
    print("- Impact demonstration")
    resp = input("Have you recorded the video? (yes/no): ").strip().lower()
    if resp == "yes":
        chk = load_checklist()
        chk["video_recorded"] = True
        save_checklist(chk)
        mark_completed()
        print("✓ Video recorded checklist item marked as completed.")
    else:
        print("Please record the video before proceeding with submission.")

def run_checklist_summary():
    """Show current checklist progress."""
    checklist = load_checklist()
    completed, total = checklist.get("completed", 0), checklist.get("total", 0)
    bar = get_progress_bar(completed, total)
    print(f"\n--- Current Checklist Progress {bar} ---")
    print(f"Submission Folder: {checklist.get('submission_folder', 'Not set')}")
    print(f"Problem Document: {checklist.get('problem_doc', 'Not set')}")
    print(f"Google Form Template: {checklist.get('google_form', 'Not set')}")
    print(f"LinkedIn Post: {checklist.get('linkedin_post', 'Not set')}")
    print(f"Video Recorded: {checklist.get('video_recorded', 'No')}")
    print("-" * 40)

def main_menu():
    """Simple CLI menu loop."""
    actions = {
        "1": ("Set up submission folder", setup_submission_folder),
        "2": ("Generate problem/solution doc", generate_problem_solution_doc),
        "3": ("Prepare Google Form answers", prepare_google_form_answers),
        "4": ("Draft LinkedIn post", draft_linkedin_post),
        "5": ("Video recording reminder", video_recording_reminder),
        "6": ("Show checklist progress", run_checklist_summary),
        "0": ("Exit", None)
    }

    while True:
        print("\n=== Hackathon Helper Menu ===")
        for key, (desc, _) in actions.items():
            print(f"{key}. {desc}")
        choice = input("Select an option (0‑6): ").strip()
        if choice == "0":
            print("Good luck with the hackathon! 🚀")
            break
        elif choice in actions:
            _, func = actions[choice]
            # Reset screen a bit before each action
            print("\n" + "-" * 30)
            func()
        else:
            print("Invalid option, try again.")

if __name__ == "__main__":
    # Initialize checklist file if missing
    load_checklist()
    main_menu()