define(function () {
    return [
        {
            "id": 1,
            "skipLoading": false,
            "isRecipient": false,
            "message": "Hej og velkommen!"
        },
        {
            "id": 2,
            "skipLoading": false,
            "isRecipient": true,
            "message": "Tak... hvad er BUSY 🤔 ?"
        },
        {
            "id": 3,
            "skipLoading": false,
            "isRecipient": false,
            "message": "BUSY specialicerer sig indenfor udvikling og rådgivning vedrørende brugergrænseflader til web og apps"
        },
        {
            "id": 4,
            "skipLoading": false,
            "isRecipient": true,
            "message": "Men... er det ikke bare udvikling af HTML, CSS og JavaScript og den slags?"
        },
        {
            "id": 5,
            "skipLoading": false,
            "isRecipient": false,
            "message": "Ikke alene. Det har vi en masse tanker om. Skal vi tage hul på dem her eller vil du læse om vores services?",
            "options": [
                {
                    "role": "primary",
                    "message": "Fortæl, fortæl!",
                    "action": "continue"
                },
                {
                    "role": "secondary",
                    "message": "Vis mig services",
                    "action": "navigate:services"
                }
            ]
        },
        {
            "id": 6,
            "skipLoading": true,
            "isRecipient": true,
            "message": "Fortæl, fortæl!"
        },
        {
            "id": 7,
            "skipLoading": false,
            "isRecipient": false,
            "message": "De elementer du nævnte er midler til at nå en række mål."
        },
        {
            "id": 8,
            "skipLoading": false,
            "isRecipient": false,
            "message": "Mål om at kunne kommunikere med samme stemme på et væld af forskellige skærmstørrelser og på tværs af mange kanaler."
        },
        {
            "id": 9,
            "skipLoading": false,
            "isRecipient": false,
            "message": "Og om at formidle et brands særegne følelse og budskab."
        },
        {
            "id": 10,
            "skipLoading": false,
            "isRecipient": false,
            "message": "Mål om hurtig indlæsning, så dine besøgende kan putte varer i kurven eller læse dit indhold uden forstyrrende ventetid."
        },
        {
            "id": 11,
            "skipLoading": false,
            "isRecipient": false,
            "message": "Om at være synlig på søgemaskiner og anvendelig for mennesker med handicap."
        },
        {
            "id": 12,
            "skipLoading": false,
            "isRecipient": false,
            "message": "Og, at alle de ting på én gang skal være realiserbare i teknisk forstand."
        },
        {
            "id": 13,
            "skipLoading": false,
            "isRecipient": true,
            "isCentered": true,
            "isLarge": true,
            "message": " 😳"
        },
        {
            "id": 14,
            "skipLoading": false,
            "isRecipient": false,
            "message": "Alt sammen væsentlige udfordringer der kræver specialistviden og erfaring at udføre i tilfredsstillende grad."
        },
        {
            "id": 15,
            "skipLoading": false,
            "isRecipient": false,
            "message": "Det er dét BUSY kan hjælpe dig og din forretning med 😘 🙌",
            "options": [
                {
                    "role": "primary",
                    "message": "Hvilke services tilbyder BUSY?",
                    "action": "navigate:services"
                },
                {
                    "role": "secondary",
                    "message": "Hvem er BUSY?",
                    "action": "navigate:about"
                }
            ]
        }
    ];
})