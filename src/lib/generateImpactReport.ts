export function generateImpactReport2025(): void {
  const reportHTML = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Moenviron Impact Report 2025</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      color: #1a1a1a;
      line-height: 1.6;
      background: #fff;
    }
    
    .page {
      width: 210mm;
      min-height: 297mm;
      padding: 20mm;
      margin: 0 auto;
      background: #fff;
    }
    
    .cover {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      min-height: calc(297mm - 40mm);
      background: linear-gradient(135deg, #2D5A43 0%, #1a3a2a 100%);
      color: white;
      padding: 40mm 30mm;
      margin: -20mm;
      margin-bottom: 20mm;
    }
    
    .cover-header {
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 4px;
      opacity: 0.7;
    }
    
    .cover-title {
      font-size: 48px;
      font-weight: 700;
      line-height: 1.1;
      margin: 40px 0;
    }
    
    .cover-subtitle {
      font-size: 20px;
      font-weight: 300;
      opacity: 0.9;
      max-width: 400px;
    }
    
    .cover-footer {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-top: auto;
    }
    
    .cover-logo {
      font-size: 24px;
      font-weight: 700;
    }
    
    .cover-date {
      font-size: 14px;
      opacity: 0.7;
    }
    
    h1 {
      font-size: 28px;
      font-weight: 700;
      margin-bottom: 20px;
      color: #2D5A43;
    }
    
    h2 {
      font-size: 20px;
      font-weight: 600;
      margin: 30px 0 15px;
      color: #1a1a1a;
      border-bottom: 2px solid #2D5A43;
      padding-bottom: 8px;
    }
    
    h3 {
      font-size: 16px;
      font-weight: 600;
      margin: 20px 0 10px;
      color: #2D5A43;
    }
    
    p {
      margin-bottom: 12px;
      color: #444;
    }
    
    .intro {
      font-size: 18px;
      color: #666;
      margin-bottom: 30px;
      padding: 20px;
      background: #f9f7f2;
      border-left: 4px solid #2D5A43;
    }
    
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
      margin: 30px 0;
    }
    
    .stat-card {
      background: linear-gradient(135deg, #f9f7f2 0%, #fff 100%);
      padding: 25px;
      border-radius: 12px;
      text-align: center;
      border: 1px solid #e5e5e5;
    }
    
    .stat-value {
      font-size: 36px;
      font-weight: 700;
      color: #2D5A43;
      display: block;
    }
    
    .stat-label {
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #888;
      margin-top: 8px;
    }
    
    .section {
      margin: 40px 0;
    }
    
    .highlight-box {
      background: #2D5A43;
      color: white;
      padding: 30px;
      border-radius: 12px;
      margin: 30px 0;
    }
    
    .highlight-box h3 {
      color: white;
      margin-top: 0;
    }
    
    .highlight-box p {
      color: rgba(255,255,255,0.9);
    }
    
    .timeline {
      position: relative;
      padding-left: 30px;
      margin: 20px 0;
    }
    
    .timeline::before {
      content: '';
      position: absolute;
      left: 8px;
      top: 0;
      bottom: 0;
      width: 2px;
      background: #2D5A43;
    }
    
    .timeline-item {
      position: relative;
      margin-bottom: 25px;
      padding-left: 20px;
    }
    
    .timeline-item::before {
      content: '';
      position: absolute;
      left: -26px;
      top: 6px;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: #2D5A43;
    }
    
    .timeline-date {
      font-size: 12px;
      color: #2D5A43;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    
    .table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
    }
    
    .table th, .table td {
      padding: 12px 15px;
      text-align: left;
      border-bottom: 1px solid #e5e5e5;
    }
    
    .table th {
      background: #f9f7f2;
      font-weight: 600;
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #666;
    }
    
    .table td {
      font-size: 14px;
    }
    
    .pillars {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
      margin: 30px 0;
    }
    
    .pillar {
      padding: 25px;
      border-radius: 12px;
      text-align: center;
    }
    
    .pillar.eliminate {
      background: #E3F2FD;
      border: 2px solid #2196F3;
    }
    
    .pillar.circulate {
      background: #E8F5E9;
      border: 2px solid #2D5A43;
    }
    
    .pillar.regenerate {
      background: #FFF8E1;
      border: 2px solid #FFA000;
    }
    
    .pillar-title {
      font-size: 18px;
      font-weight: 700;
      margin-bottom: 10px;
    }
    
    .pillar-desc {
      font-size: 13px;
      color: #666;
    }
    
    .footer {
      margin-top: 50px;
      padding-top: 20px;
      border-top: 1px solid #e5e5e5;
      font-size: 12px;
      color: #888;
      text-align: center;
    }
    
    .page-break {
      page-break-after: always;
    }
    
    @media print {
      body {
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
      
      .page {
        margin: 0;
        padding: 15mm;
      }
      
      .cover {
        margin: -15mm;
        padding: 30mm 25mm;
      }
    }
  </style>
</head>
<body>
  <div class="page">
    <div class="cover">
      <div>
        <div class="cover-header">Annual Impact Report</div>
        <h1 class="cover-title">Moenviron<br/>Impact Report<br/>2025</h1>
        <p class="cover-subtitle">Transforming textile waste into opportunity through circular fashion solutions connecting the UK and Kenya.</p>
      </div>
      <div class="cover-footer">
        <div class="cover-logo">MOENVIRON</div>
        <div class="cover-date">January 2025</div>
      </div>
    </div>
  </div>
  
  <div class="page">
    <h1>Executive Summary</h1>
    
    <p class="intro">
      In 2025, Moenviron has made significant strides in our mission to create a truly circular textile economy. This report details our environmental impact, community empowerment initiatives, and the tangible progress we've made toward eliminating textile waste.
    </p>
    
    <div class="stats-grid">
      <div class="stat-card">
        <span class="stat-value">15.4t</span>
        <span class="stat-label">Textiles Recovered</span>
      </div>
      <div class="stat-card">
        <span class="stat-value">892kg</span>
        <span class="stat-label">CO₂ Offset</span>
      </div>
      <div class="stat-card">
        <span class="stat-value">45</span>
        <span class="stat-label">Jobs Created</span>
      </div>
    </div>
    
    <h2>Our Circular Model</h2>
    
    <div class="pillars">
      <div class="pillar eliminate">
        <div class="pillar-title">Eliminate</div>
        <p class="pillar-desc">Waste and pollution by design through source interception</p>
      </div>
      <div class="pillar circulate">
        <div class="pillar-title">Circulate</div>
        <p class="pillar-desc">Products and materials at their highest value</p>
      </div>
      <div class="pillar regenerate">
        <div class="pillar-title">Regenerate</div>
        <p class="pillar-desc">Nature and local ecosystems through restoration</p>
      </div>
    </div>
    
    <p>Our three-pillar approach, inspired by the Ellen MacArthur Foundation's circular economy principles, guides every aspect of our operations. From intercepting textiles before they reach landfills to empowering Kenyan artisans with dignified employment, we're building a system that benefits both people and planet.</p>
  </div>
  
  <div class="page">
    <h2>Environmental Impact</h2>
    
    <h3>Textile Recovery</h3>
    <p>Through our multi-point collection network spanning the UK and Kenya, we've intercepted 15.4 tonnes of textiles that would otherwise end up in landfills or waterways. Our Nairobi River Recovery initiative alone has prevented over 3 tonnes of textile waste from entering the ecosystem.</p>
    
    <table class="table">
      <thead>
        <tr>
          <th>Category</th>
          <th>Volume (tonnes)</th>
          <th>% of Total</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Cotton & Natural Fibers</td>
          <td>6.2</td>
          <td>40%</td>
        </tr>
        <tr>
          <td>Synthetic Blends</td>
          <td>4.6</td>
          <td>30%</td>
        </tr>
        <tr>
          <td>Denim</td>
          <td>3.1</td>
          <td>20%</td>
        </tr>
        <tr>
          <td>Other Materials</td>
          <td>1.5</td>
          <td>10%</td>
        </tr>
      </tbody>
    </table>
    
    <h3>Carbon Footprint Reduction</h3>
    <p>By diverting textiles from landfill and enabling their reuse and recycling, we've prevented an estimated 892kg of CO₂ equivalent emissions. This is comparable to removing 194 cars from the road for a full day.</p>
    
    <div class="highlight-box">
      <h3>Water Conservation</h3>
      <p>Our closed-loop production processes have saved approximately 45,000 liters of water compared to virgin textile manufacturing. We've achieved this through:</p>
      <ul style="margin-top: 10px; padding-left: 20px;">
        <li>Waterless dyeing techniques where possible</li>
        <li>Greywater recycling at our Nairobi hub</li>
        <li>Elimination of toxic chemical runoff</li>
      </ul>
    </div>
  </div>
  
  <div class="page">
    <h2>Social Impact</h2>
    
    <h3>Employment & Livelihoods</h3>
    <p>At the heart of our mission is creating dignified employment for Kenyan artisans. Our Kibera Production Hub has become a center of innovation and skill development.</p>
    
    <div class="stats-grid">
      <div class="stat-card">
        <span class="stat-value">45</span>
        <span class="stat-label">Direct Jobs Created</span>
      </div>
      <div class="stat-card">
        <span class="stat-value">120+</span>
        <span class="stat-label">Indirect Beneficiaries</span>
      </div>
      <div class="stat-card">
        <span class="stat-value">67%</span>
        <span class="stat-label">Women Employed</span>
      </div>
    </div>
    
    <h3>Skills Development</h3>
    <p>We've invested in comprehensive training programs that preserve traditional Kenyan weaving techniques while introducing modern sustainable fashion practices.</p>
    
    <div class="timeline">
      <div class="timeline-item">
        <div class="timeline-date">Q1 2025</div>
        <p><strong>Artisan Certification Program</strong> — 25 artisans completed our 12-week intensive program in circular design principles.</p>
      </div>
      <div class="timeline-item">
        <div class="timeline-date">Q2 2025</div>
        <p><strong>Digital Skills Workshop</strong> — Introduction of product photography and e-commerce training for artisan entrepreneurs.</p>
      </div>
      <div class="timeline-item">
        <div class="timeline-date">Q3 2025</div>
        <p><strong>Youth Apprenticeship</strong> — Launch of 6-month apprenticeship program for 15 young people from Kibera.</p>
      </div>
    </div>
    
    <h3>Fair Wage Commitment</h3>
    <p>All Moenviron artisans receive wages that exceed the Kenyan living wage by at least 25%. We believe that sustainable fashion must also mean sustainable livelihoods for the people who create it.</p>
  </div>
  
  <div class="page">
    <h2>Traceability & Transparency</h2>
    
    <p>Every product that leaves our facility carries a complete history. Our digital passport system enables customers and partners to trace the journey of their garment from source to store.</p>
    
    <h3>Material Traceability</h3>
    <table class="table">
      <thead>
        <tr>
          <th>Tracking Point</th>
          <th>Data Captured</th>
          <th>Coverage</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Collection Source</td>
          <td>Location, date, material type</td>
          <td>100%</td>
        </tr>
        <tr>
          <td>Sorting & Classification</td>
          <td>Material composition, quality grade</td>
          <td>100%</td>
        </tr>
        <tr>
          <td>Production</td>
          <td>Artisan ID, techniques used, hours</td>
          <td>100%</td>
        </tr>
        <tr>
          <td>Quality Assurance</td>
          <td>Inspection results, certifications</td>
          <td>100%</td>
        </tr>
      </tbody>
    </table>
    
    <h2>Looking Ahead: 2026 Goals</h2>
    
    <div class="highlight-box">
      <h3>Our Commitments for 2026</h3>
      <ul style="padding-left: 20px;">
        <li>Recover 25 tonnes of textile waste (62% increase)</li>
        <li>Create 30 additional artisan jobs</li>
        <li>Launch regenerative cotton pilot in Makueni County</li>
        <li>Achieve B Corp certification</li>
        <li>Expand brand partnerships to 15 UK retailers</li>
      </ul>
    </div>
    
    <div class="footer">
      <p><strong>Moenviron Ltd.</strong></p>
      <p>Connecting UK Fashion Waste to Kenyan Artisan Innovation</p>
      <p>www.moenviron.com | info@moenviron.com</p>
      <p style="margin-top: 15px; font-size: 10px;">© 2025 Moenviron. All rights reserved. This report contains verified impact data as of January 2025.</p>
    </div>
  </div>
</body>
</html>
  `;

  const blob = new Blob([reportHTML], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  
  const printWindow = window.open(url, '_blank');
  if (printWindow) {
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print();
      }, 500);
    };
  } else {
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Moenviron-Impact-Report-2025.html';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  
  setTimeout(() => URL.revokeObjectURL(url), 10000);
}
