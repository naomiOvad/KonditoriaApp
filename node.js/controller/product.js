
const fs = require('fs');

function get(req, res) {
    fs.readFile("products.json", "utf-8", (err, data) => {
        if (err) {
            res.status(500).send("error read file student ")
        } else {

            if (!data) {
                return res.status(500).send("Empty or invalid JSON file");
            }
            res.send(JSON.parse(data));
        }

    })
}
//אפשרות ראשונה ליצא פונקציה מדף
exports.getById = (req, res) => {

    fs.readFile("products.json", "utf-8", (err, data) => {
        if (err) {
            res.status(500).send("error read file student ")
        } else {
            let id = req.params.id;

            data = JSON.parse(data);
            let product = data.find(st => st.id == id)

            if (product == undefined) {
                res.status(500).send("not found student by tz " + id);
            } else {
                res.send(product);
            }

        }


    })
}


// exports.post = (req, res) => {

//     fs.readFile("products.json", "utf-8", (err, data) => {
//         //המרה של טקסט למערך
//         let products = JSON.parse(data);
//         //body =  לתוכן שנשלח בפונקציה פןסט 
//         let product = req.body
//         // מוסיף איידי למוצר החדש 
//         products.push(product);
//         fs.writeFile("products.json", JSON.stringify(products), (err) => {
//             if (err) {
//                 res.status(500).send("error  in add products ");
//             } else {
//                 res.send(product);
//             }
//         })
//     })
// }

exports.post = (req, res) => {
    fs.readFile("products.json", "utf-8", (err, data) => {
        if (err) {
            return res.status(500).send("שגיאה בקריאת הקובץ");
        }

        let products = JSON.parse(data || "[]");

        console.log("BODY:", req.body);

        // מחשב ID חדש לפי המקסימלי
        let lastId = products.reduce((max, p) => (p.id > max ? p.id : max), 0);
        let newId = lastId + 1;

        // בונה אובייקט חדש במקום לשנות את req.body
        const newProduct = { ...req.body, id: newId };
        products.push(newProduct);

        fs.writeFile("products.json", JSON.stringify(products, null, 2), (err) => {
            if (err) {
                res.status(500).send("שגיאה בהוספת מוצר");
            } else {
                res.send(newProduct);
            }
        });
    });
};



exports.put = (req, res) => {
    fs.readFile("products.json", "utf-8", (err, data) => {
        if (err) {
            res.status(500).send("error reading products file");
        } else {
            let products = JSON.parse(data);
            let id = req.params.id;
            let index = products.findIndex(p => p.id == id);

            if (index === -1) {
                res.status(404).send("product not found");
            } else {
                // מעדכנים את המוצר לפי מה שהגיע ב-body
                products[index] = { ...products[index], ...req.body };

                fs.writeFile("products.json", JSON.stringify(products, null, 2), (err) => {
                    if (err) {
                        res.status(500).send("error writing updated product");
                    } else {
                        res.send(products[index]);
                    }
                });
            }
        }
    });
};

exports.delete = (req, res) => {
    fs.readFile("products.json", "utf-8", (err, data) => {
        if (err) {
            res.status(500).send("error reading products file");
        } else {
            let products = JSON.parse(data);
            let id = req.params.id;
            let index = products.findIndex(p => p.id == id);

            if (index === -1) {
                res.status(404).send("product not found");
            } else {
                let deleted = products.splice(index, 1);

                fs.writeFile("products.json", JSON.stringify(products, null, 2), (err) => {
                    if (err) {
                        res.status(500).send("error deleting product");
                    } else {
                        res.send({ message: "deleted successfully", deleted: deleted[0] });
                    }
                });
            }
        }
    });
};



//אפשרות שניה ליצא פונקציה מדף
exports.get = get;
