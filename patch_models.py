import re

with open("../ridgenooks-backend/models.py", "r") as f:
    content = f.read()

if "phone = Column(String" not in content:
    content = content.replace("hashed_password = Column(String)", "hashed_password = Column(String)\n    phone = Column(String, nullable=True)")
    with open("../ridgenooks-backend/models.py", "w") as f:
        f.write(content)
print("Models patched locally")
