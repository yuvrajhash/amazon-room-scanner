# Amazon Room Scanner Project

## Overview
This project is a modern Amazon-inspired web application featuring an AI-powered room scanner. It combines a visually rich UI, responsive layouts, and advanced features such as WebXR-based room scanning and CLIP-powered AI recommendations. The project demonstrates both classic HTML/CSS approaches and a Next.js/React implementation for scalability and maintainability.

### 🏆 Hackathon Submission

**Problem:** Shopping for furniture online is hard because you can't visualize it in your space.

**Solution:** Our AI scans your room and recommends perfectly sized, styled products that match your existing decor.

**Demo:** Watch how we transform a simple room scan into personalized product recommendations with our AI/XR integration!

## Features
- **Amazon-style UI**: Header, navigation, hero banners, product cards, and category grids.
- **Responsive Design**: Mobile-first layouts using Tailwind CSS and modern CSS utilities.
- **AI Room Scanner**: WebXR integration for room scanning, with CLIP-powered AI for style and dimension analysis.
- **Mock 3D Room Scan Animation**: Three.js-powered visualization with point cloud generation and room modeling.
- **Interactive Scanning Process**: Progress bar with playful status messages ("Analyzing wall colors...", "Detecting furniture styles...").
- **Personalized Recommendations**: AI suggests furniture and products based on scanned room data.
- **Sustainability Metrics**: Eco Score and CO2 savings information for recommended products.
- **Voice Command Integration**: "Alexa, scan my room" voice command simulation.
- **Augmented Reality Preview**: Try furniture in your space with AR integration.
- **How It Works Overlay**: Detailed explanation of CLIP and WebXR technology with visual examples.
- **Product Catalog**: Mock product data with real images, ratings, Prime badges, and category highlights.
- **Component-based Architecture**: Modular React components for header, product cards, and scanner integration.
- **Image Optimization**: Uses Next.js Image component for fast, responsive images.
- **UI/UX Enhancements**: Hover effects, gradients, rounded cards, and accessible color schemes.
- **Metrics Dashboard**: Live counter showing rooms scanned globally.

## Project Structure
- `/src/app/page.tsx` — Main Next.js page, includes all major UI sections and product logic.
- `/src/components/AmazonHeaderWithScanner.tsx` — Header with integrated scanner button.
- `/src/components/ProductCard.tsx` — Reusable product card component.
- `/public/images/` — Realistic product and category images.
- `amazon-clone.html` — Classic HTML/CSS Amazon clone for reference.
- `amazon-clone-with-scanner.html` — Enhanced HTML/CSS version with scanner UI.

## Key Files
- **page.tsx**: Implements the homepage, category grids, hero banners, scanner feature highlight, and product grid using React and Tailwind CSS.
- **AmazonHeaderWithScanner.tsx**: Contains the Amazon-style header and scanner trigger.
- **ProductCard.tsx**: Displays product details, images, ratings, and Prime status.
- **HTML Reference Files**: Show the evolution from static HTML to a dynamic React/Next.js app.

## How to Run
1. **Install dependencies**:
   ```
   npm install
   ```
2. **Start the development server**:
   ```
   npm run dev
   ```
   The app will be available at [http://localhost:3000](http://localhost:3000).

## Extending the Project
- Add real product data and backend integration.
- Enhance the AI scanner with real WebXR and CLIP model APIs.
- Expand category and recommendation logic.
- Improve accessibility and add more tests.

## Future Plans
- **Partner Integrations**: Connect with Amazon Home Services for professional room measurements and furniture assembly.
- **Advanced AI Features**: Implement style transfer to show how new furniture would look with existing decor.
- **Social Sharing**: Allow users to share their room scans and get feedback from friends or interior designers.
- **Sustainability Focus**: Expand eco-friendly product options and carbon footprint tracking.
- **Enterprise Solutions**: Develop B2B version for interior designers and real estate professionals.

## Credits
- Product and category images from Unsplash.
- Inspired by Amazon's UI/UX.

---
This README summarizes all major work, features, and files in the project. For further details, review the source code and components.
