import json

def convert_json_to_jsonl(input_file, output_file):
    with open(input_file, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    with open(output_file, 'w', encoding='utf-8') as f:
        for entry in data:
            highlight_yellow = [h["word"] for h in entry["highlights"] if h["color"] == "yellow"]
            highlight_green = [h["word"] for h in entry["highlights"] if h["color"] == "lightgreen"]
            
            new_entry = {
                "prompt": entry["prompt"],
                "highlight_yellow": highlight_yellow,
                "highlight_green": highlight_green
            }
            f.write(json.dumps(new_entry, ensure_ascii=False) + "\n")

convert_json_to_jsonl("data/raw/highlighted_prompts.json", "data/clean_raw/dataset_classification.jsonl")