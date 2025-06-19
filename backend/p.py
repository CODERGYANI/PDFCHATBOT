from pdf2image import convert_from_path

images = convert_from_path("documents/womens.pdf")
print(f"✅ Pages converted: {len(images)}")
