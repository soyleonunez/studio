# **App Name**: PetPal Quotes

## Core Features:

- Company Configuration: Allows the user to set up and store company details such as name, address, contact info, tax ID, logo URL, disclaimer text, and accent color.
- Dashboard Overview: Displays a clear dashboard with a prominent call-to-action to create a new estimate and lists recent estimates with key information like ID, pet name, date, and total.
- Estimate Form: Enables users to input estimate details, including owner and pet information, and create line items with service, description, quantity, and price, and auto calculates each line amount, subtotal, and the final amount after the optional tax is applied.
- Real-time Calculation: Provide on-the-fly calculations of line item totals, subtotals, and total amounts based on entered quantities, unit prices, and tax rates. Tax rate should be optional, defaulting to zero.
- PDF Generation: Generates downloadable PDF estimates in multiple formats (Letter, Half-Letter, Digital 1:1, Digital 9:16) styled after an airline ticket, using the stored company configuration and including the logo, company information, client/pet details, and disclaimer. This tool automatically incorporates or omits information as appropriate given the constraints of each specific output format.
- Firestore Integration: Uses Firebase Firestore to persist company configurations and generated estimates, ensuring data is stored reliably for retrieval, reuse, and reference.

## Style Guidelines:

- Primary color: Deep sky blue (#34ace0) for a clean and professional aesthetic, reminiscent of the sky and air travel.
- Background color: Light gray (#f0f2f5), providing a neutral backdrop that emphasizes content.
- Accent color: Orange (#ff8c00) to highlight interactive elements and call-to-action buttons, ensuring prominence and usability. Note that this color will match that of the airline ticket example.
- Secondary color: Soft green (#a8e6cf) for a calm and natural feel.
- Body and headline font: 'Inter', a sans-serif font for a modern, machine-like look.
- Use minimalist icons from Shadcn/ui to represent actions and data points within the dashboard and form, improving clarity and user engagement.
- Employ a modern, clean layout inspired by Shadcn/Tailwind CSS, ensuring responsiveness across devices. Use cards for main sections and tables for data display, mirroring the air ticket design.
- Implement subtle transitions and animations using Shadcn/ui components to provide a polished and engaging user experience.