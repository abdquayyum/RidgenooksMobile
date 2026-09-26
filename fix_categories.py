with open("src/app/(tabs)/index.tsx", "r") as f:
    content = f.read()

old_categories = 'const categories = ["All", "Apartment", "House", "Villa", "Cabin"];'
new_categories = 'const categories = ["All", "Apartments", "Villas", "Lofts", "Penthouses", "Studios"];'

content = content.replace(old_categories, new_categories)

with open("src/app/(tabs)/index.tsx", "w") as f:
    f.write(content)
print("Mobile app categories fixed!")

with open("../ridgenooks-backend/static/admin.html", "r") as f:
    admin_content = f.read()

old_admin = """                    <div><label className="text-sm font-semibold text-slate-500 mb-1 block">Category</label>
                      <select className="w-full border border-slate-300 p-3 rounded-xl" value={category} onChange={e=>setCategory(e.target.value)}>
                        <option>Short Stay</option><option>Rent</option><option>Buy</option>
                      </select>
                    </div>"""
new_admin = """                    <div><label className="text-sm font-semibold text-slate-500 mb-1 block">Category</label>
                      <select className="w-full border border-slate-300 p-3 rounded-xl" value={category} onChange={e=>setCategory(e.target.value)}>
                        <option>Apartments</option><option>Villas</option><option>Lofts</option><option>Penthouses</option><option>Studios</option>
                      </select>
                    </div>"""

admin_content = admin_content.replace(old_admin, new_admin)

with open("../ridgenooks-backend/static/admin.html", "w") as f:
    f.write(admin_content)
print("Admin dashboard categories fixed!")
