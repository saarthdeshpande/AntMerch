const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

sendMail = (email, productCount, orderId, name) => {
    console.log(email, productCount, orderId, name)
    const http = require("https");

    const options = {
        "method": "POST",
        "hostname": "api.sendgrid.com",
        "port": null,
        "path": "/v3/mail/send",
        "headers": {
            "authorization": `Bearer ${process.env.SENDGRID_API_KEY}`,
            "content-type": "application/json"
        }
    };

    const req = http.request(options, function (res) {
        let chunks = [];

        res.on("data", function (chunk) {
            chunks.push(chunk);
        });

        res.on("end", function () {
            const body = Buffer.concat(chunks);
            console.log(body.toString());
        });
    });

    req.write(JSON.stringify({ personalizations:
            [ { to: [ { email, name } ],
                dynamic_template_data: { productCount, orderId, name  },
                subject: 'Hello, World!' } ],
        from: { email: 'deshpandesaarth@gmail.com', name: 'AntMerch' },
        reply_to: { email: 'deshpandesaarth@gmail.com', name: 'AntMerch' },
        template_id: process.env.SENDGRID_TEMPLATE_ID }));
    req.end();
}

module.exports = sendMail