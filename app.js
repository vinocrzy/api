const Prisma = require('@prisma/client');
const express = require('express');
const cors = require('cors');
const Joi = require('joi');

const app = express();

const prisma = new Prisma.PrismaClient();

const port = 3001;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.get("/api/login", async (req, res) => {
    try {
        const notes = await prisma.notes.findMany();
        res.json(notes);
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong",
        });
    }
});

app.post("/api/register", async (req, res) => {

    const payload = req?.body; // 

    const Schema = Joi.object({
        basicInfo: Joi.object({
            companyInfo: Joi.object({
                name: Joi.string().required(),
                address: Joi.string().required(),
                country: Joi.string().required(),
                pincode: Joi.number().required(),
                city: Joi.string().required(),
                cuntrycode: Joi.string().required(),
                phone: Joi.number().required(),
                website: Joi.string(),
            }),
            keyPerson: Joi.object({
                name: Joi.string().required(),
                designation: Joi.string().required(),
                cuntrycode: Joi.string().required(),
                phone: Joi.number().required(),
                email: Joi.string().required(),
            })
        }),
        companyInfo: Joi.object({
            moreData: Joi.object({
                profileSummary: Joi.string().required(),
                socialLink: Joi.string(),
                visionMission: Joi.string()
            }),
            managementTeam: Joi.object({
                name: Joi.string(),
                designation: Joi.string(),
                profileSummary: Joi.string(),
                linkedinProfile: Joi.string(),

            })
        }),
        productPortfolio: Joi.object({
            name: Joi.string().required(),
            discription: Joi.string().required(),
            url: Joi.string().required(),
        }),

    })

    const { basicInfo, companyInfo, productPortfolio } = Schema.validate(payload).value
    let error = Schema.validate(payload).error

    if (error) {
        res.status(500).json({
            message: "Input Validation Error",
        });
    }



    try {
        if (basicInfo) {
            const newBasicInfo = await prisma.basicInfo.create({
                data: basicInfo,
            });

        } else {
            res.status(500).json({
                message: "Validation Error",
            });
        }
        if (companyInfo) {
            const newcompanyInfo = await prisma.companyInfo.create({
                data: companyInfo,
            });

        } else {
            res.status(500).json({
                message: "Validation Error",
            });
        }
        if (productPortfolio) {
            const newproductPortfolio = await prisma.productPortfolio.create({
                data: productPortfolio,
            });

        } else {
            res.status(500).json({
                message: "Validation Error",
            });
        }

        res.status(200).json({
            message: "Register Sucessfully",
        });

    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            message: "Internal Server Error",
        });
    }


});



app.listen(port, function () {
    console.log(`App is listening on port ${port} !`);
});