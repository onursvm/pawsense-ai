import json
import numpy as np
import onnxruntime as ort
from PIL import Image

def test():
    print("Loading class names...")
    with open("class_names.json", "r", encoding="utf-8") as f:
        classes = json.load(f)
    print(f"Loaded {len(classes)} classes: {classes}")

    print("Loading ONNX model...")
    session_options = ort.SessionOptions()
    session_options.graph_optimization_level = ort.GraphOptimizationLevel.ORT_ENABLE_ALL
    session = ort.InferenceSession("mobilenetv3_imagewoof.onnx", sess_options=session_options, providers=["CPUExecutionProvider"])

    inputs = session.get_inputs()
    outputs = session.get_outputs()

    print(f"Inputs: {[(i.name, i.shape, i.type) for i in inputs]}")
    print(f"Outputs: {[(o.name, o.shape, o.type) for o in outputs]}")

    input_name = inputs[0].name
    output_name = outputs[0].name

    # Dummy inference
    dummy = np.random.randn(1, 3, 224, 224).astype(np.float32)
    res = session.run([output_name], {input_name: dummy})[0]
    print(f"Inference successful! Output shape: {res.shape}, sample logits: {res[0][:4]}")

    # Softmax test
    exp_logits = np.exp(res[0] - np.max(res[0]))
    probs = exp_logits / np.sum(exp_logits)
    print(f"Softmax sum: {np.sum(probs):.4f}")
    top_idx = int(np.argmax(probs))
    print(f"Top class: {classes[top_idx]} with confidence: {probs[top_idx]:.4f}")

if __name__ == "__main__":
    test()
