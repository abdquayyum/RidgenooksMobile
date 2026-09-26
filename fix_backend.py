with open("../ridgenooks-backend/main.py", "r") as f:
    content = f.read()

# Update PaymentIntentRequest
old_intent_req = """class PaymentIntentRequest(BaseModel):
    amount: int
    currency: str = "usd\""""
new_intent_req = """class PaymentIntentRequest(BaseModel):
    amount: int
    currency: str = "usd"
    property_id: int
    nights: int"""
content = content.replace(old_intent_req, new_intent_req)

# Update create_payment_intent
old_intent_def = """@app.post("/api/create-payment-intent")
def create_payment_intent(req: PaymentIntentRequest):
    try:
        # Create a PaymentIntent with the order amount and currency
        intent = stripe.PaymentIntent.create(
            amount=req.amount,
            currency=req.currency,
            automatic_payment_methods={
                'enabled': True,
            },
        )"""

new_intent_def = """@app.post("/api/create-payment-intent")
def create_payment_intent(req: PaymentIntentRequest, db: Session = Depends(get_db)):
    try:
        # Verify amount on server side
        prop = db.query(models.Property).filter(models.Property.id == req.property_id).first()
        if not prop:
            raise HTTPException(status_code=404, detail="Property not found")
        
        raw_price = int(prop.price.replace(',', ''))
        # Service fee: $25 (2500 cents) if USD, NGN 25000 (2500000 kobo) if NGN
        service_fee = 2500 if req.currency.lower() == 'usd' else 2500000
        
        # Stripe amount is in cents/kobo
        expected_amount = (raw_price * req.nights * 100) + service_fee
        
        if req.amount != expected_amount:
            raise HTTPException(status_code=400, detail="Price mismatch detected.")
            
        intent = stripe.PaymentIntent.create(
            amount=expected_amount,
            currency=req.currency,
            automatic_payment_methods={
                'enabled': True,
            },
        )"""
content = content.replace(old_intent_def, new_intent_def)

# Update add_transaction to verify amount
old_add_txn = """    txn = models.Transaction(
        id=req.ref,
        amount=req.amount,
        currency=req.currency,"""
        
new_add_txn = """    # Verify amount
    prop = db.query(models.Property).filter(models.Property.id == req.property_id).first()
    if prop:
        raw_price = int(prop.price.replace(',', ''))
        nights = (co - ci).days if co and ci else 1
        expected_total = (raw_price * nights) + (25 if req.currency.lower() == 'usd' else 25000)
        if req.amount < expected_total:
            raise HTTPException(status_code=400, detail="Invalid payment amount")

    txn = models.Transaction(
        id=req.ref,
        amount=req.amount,
        currency=req.currency,"""
content = content.replace(old_add_txn, new_add_txn)

with open("../ridgenooks-backend/main.py", "w") as f:
    f.write(content)
print("Backend security fixed!")
