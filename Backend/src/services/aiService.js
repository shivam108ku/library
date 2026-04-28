const ai = require("../config/ai");
const { extractJSONFromCodeBlock } = require("../utils/helperFunctions");

const generateSeatNo = async (prompt) => {
    try {
        // if(!prompt)
        //   throw error

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
            temperature: 0.0,
            },
        });

        console.log(response.text);

        const extractedJSON = extractJSONFromCodeBlock(response.text);

        let seatNo;
        if(extractedJSON)
            seatNo = JSON.parse(extractedJSON);
        else
            seatNo = JSON.parse(response.text);

        return seatNo;

    } catch (error) {
        
        // throw error
        console.log(error);

    }
};

module.exports = { generateSeatNo };