with open("src/app/(tabs)/index.tsx", "r") as f:
    content = f.read()

# Increase container padding from pb-6 px-5 to pb-10 px-6
content = content.replace('className="pb-6 px-5 bg-slate-900 rounded-b-3xl shadow-md"', 'className="pb-10 px-6 bg-slate-900 rounded-b-3xl shadow-md"')

# Increase margin below the location/profile row
content = content.replace('className="flex-row justify-between items-center mb-6"', 'className="flex-row justify-between items-center mb-8"')

# Increase margin and font size for "Find your perfect place."
content = content.replace('className="text-2xl font-bold text-white mb-4"', 'className="text-3xl font-bold text-white mb-6 mt-2"')

# Make the search bar slightly taller
content = content.replace('px-4 py-3 border border-slate-700"', 'px-5 py-4 border border-slate-700"')

with open("src/app/(tabs)/index.tsx", "w") as f:
    f.write(content)
print("Header patched!")
