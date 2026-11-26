import app from "./app.js"

app.listen(process.env.PORT || 4000, () => 
    console.log(`Gateway is running on PORT: ${process.env.PORT || 4000}`)
);