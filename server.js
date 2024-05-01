// This is your test secret API key.
const dotenv = require("dotenv");
dotenv.config();
const stripe = require("stripe")(process.env.CLIENT_SECRET_KEY);
const express = require("express");
const app = express();
app.use(express.static("public"));

const YOUR_DOMAIN = "http://localhost:3000";
console.log(process.env.CLIENT_SECRET_KEY);
app.post("/create-checkout-session", async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    ui_mode: "embedded",
    line_items: [
      {
        // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
        price_data: {
          currency: "usd",
          unit_amount: 2000,
          product_data: {
            name: "T-shirt",
            description: "Comfortable cotton t-shirt",
            images: [
              "https://uniform7-static.myshopblocks.com/images/2021/06/contain/2048x2048/0561ca0e8aa2b00b8629b0fa23bf2519.jpg",
            ],
          },
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    return_url: `${YOUR_DOMAIN}/return?session_id={CHECKOUT_SESSION_ID}`,
  });

  res.send({ clientSecret: session.client_secret });
});

app.get("/session-status", async (req, res) => {
  const session = await stripe.checkout.sessions.retrieve(req.query.session_id);

  res.send({
    status: session.status,
    customer_email: session.customer_details.email,
  });
});

app.listen(4000, () => console.log("Running on port 4242"));
