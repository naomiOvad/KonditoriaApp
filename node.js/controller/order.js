const fs = require('fs');

// קריאת כל ההזמנות
function get(req, res) {
    fs.readFile("orders.json", "utf-8", (err, data) => {
        if (err) {
            return res.status(500).send("שגיאה בקריאת קובץ ההזמנות");
        }

        if (!data) {
            return res.status(500).send("הקובץ ריק או לא תקין");
        }

        res.send(JSON.parse(data));
    });
}

// שליפה לפי מזהה לקוח (userId)
exports.getByUserId = (req, res) => {
    fs.readFile("orders.json", "utf-8", (err, data) => {
        if (err) {
            return res.status(500).send("שגיאה בקריאת הקובץ");
        }

        const orders = JSON.parse(data || "[]");
        const userId = parseInt(req.params.id);
        const userOrders = orders.filter(o => o.userId === userId);

        if (userOrders.length === 0) {
            res.status(404).send("לא נמצאו הזמנות למשתמש זה");
        } else {
            res.send(userOrders);
        }
    });
};

// הוספת הזמנה חדשה
exports.post = (req, res) => {
    fs.readFile("orders.json", "utf-8", (err, data) => {
        if (err) {
            return res.status(500).send("שגיאה בקריאת קובץ ההזמנות");
        }

        let orders = JSON.parse(data || "[]");

        // יצירת מזהה חדש
        let lastId = orders.reduce((max, o) => (o.id > max ? o.id : max), 0);
        let newId = lastId + 1;

        const newOrder = { ...req.body, id: newId };
        orders.push(newOrder);

        fs.writeFile("orders.json", JSON.stringify(orders, null, 2), (err) => {
            if (err) {
                res.status(500).send("שגיאה בהוספת ההזמנה");
            } else {
                res.send(newOrder);
            }
        });
    });
};

// עדכון הזמנה
exports.put = (req, res) => {
    fs.readFile("orders.json", "utf-8", (err, data) => {
        if (err) {
            return res.status(500).send("שגיאה בקריאת הקובץ");
        }

        let orders = JSON.parse(data || "[]");
        const id = parseInt(req.params.id);
        const index = orders.findIndex(o => o.id === id);

        if (index === -1) {
            res.status(404).send("הזמנה לא נמצאה");
        } else {
            orders[index] = { ...orders[index], ...req.body };

            fs.writeFile("orders.json", JSON.stringify(orders, null, 2), (err) => {
                if (err) {
                    res.status(500).send("שגיאה בעדכון ההזמנה");
                } else {
                    res.send(orders[index]);
                }
            });
        }
    });
};

// מחיקת הזמנה
exports.delete = (req, res) => {
    fs.readFile("orders.json", "utf-8", (err, data) => {
        if (err) {
            return res.status(500).send("שגיאה בקריאת קובץ ההזמנות");
        }

        let orders = JSON.parse(data || "[]");
        const id = parseInt(req.params.id);
        const index = orders.findIndex(o => o.id === id);

        if (index === -1) {
            res.status(404).send("הזמנה לא נמצאה");
        } else {
            const deleted = orders.splice(index, 1);

            fs.writeFile("orders.json", JSON.stringify(orders, null, 2), (err) => {
                if (err) {
                    res.status(500).send("שגיאה במחיקת ההזמנה");
                } else {
                    res.send({ message: "הזמנה נמחקה בהצלחה", deleted: deleted[0] });
                }
            });
        }
    });
};

// ייצוא אפשרות שנייה
exports.get = get;
