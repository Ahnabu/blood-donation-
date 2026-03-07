# **Comprehensive Functional and Technical Requirements Specification for an Integrated Blood Management and Resource Allocation Ecosystem**

The critical nature of blood logistics within the global healthcare infrastructure necessitates a sophisticated, digitally integrated solution that transcends traditional manual recording and fragmented communication. The implementation of a specialized web platform designed for the coordination of blood donors and receivers represents a vital intervention in emergency medical response and elective surgical planning.1 By leveraging the MERN (MongoDB, Express, React, Node.js) stack, specifically utilizing the Next.js framework, the system provides the requisite performance, scalability, and real-time data handling capabilities essential for lifesaving interventions.3 This document outlines an exhaustive technical and functional blueprint for such a platform, addressing the complex interactions between donors, receivers, and administrators while maintaining rigorous standards for identity verification, medical eligibility, and data security.5

## **Technical Foundations and Architectural Rationale**

The selection of the MERN stack with Next.js is driven by the need for a unified development language and a robust, high-performance architecture.3 Next.js, as a React framework, extends the capabilities of standard client-side applications by introducing server-side rendering (SSR), static site generation (SSG), and incremental static regeneration (ISR).7 These features are particularly pertinent for a blood management system where real-time dashboard updates must be balanced with the need for high search engine visibility to attract potential donors.7

| Component | Technology | Functional Rationale |
| :---- | :---- | :---- |
| **Frontend Framework** | Next.js (React) | Supports App Router for simplified navigation and Server Actions for secure form handling.7 |
| **Backend Runtime** | Node.js | Provides an asynchronous, event-driven environment for high-concurrency notification triggers.3 |
| **API Architecture** | Next.js API Routes | Facilitates the creation of serverless functions for handling matching algorithms and NID verification.4 |
| **Database Layer** | MongoDB Atlas | Utilizes a BSON-based document model to manage polymorphic medical records and donor histories efficiently.3 |
| **State Management** | React Context API / Zustand | Manages global user state and role-based permissions throughout the session.9 |
| **Styling & UI** | Tailwind CSS / Headless UI | Enables the development of highly responsive and accessible dashboards for cross-platform utility.2 |

The database architecture is designed for maximum flexibility, allowing for the storage of unstructured medical data while maintaining strict indexing for location-based and blood-group-based queries.2 MongoDB’s geospatial indexing is leveraged to facilitate the proximity matching required for emergency blood requests.2

## **Authentication and User Governance Framework**

The integrity of a blood management system rests upon the reliability of its users.12 The platform implements a secure authentication lifecycle that begins with standard registration and culminates in a multi-stage identity verification process.12

### **Signup and Login Lifecycle**

The entry point for all users is a centralized signup and login module.15 The registration process collects foundational credentials, including a valid email address and a strong password, which is subsequently hashed using the ![][image1] algorithm with a minimum of ten salt rounds.16 Role identification is mandatory at the point of signup, as it determines the subsequent data fields required for the user profile.15

| Role | Access Governance | Operational Objective |
| :---- | :---- | :---- |
| **Donor** | Protected Dashboard | Access to eligibility screening, appointment scheduling, and historical data.15 |
| **Receiver** | Protected Dashboard | Submission of clinical requests, status tracking, and urgency management.20 |
| **Admin** | Restricted Panel | System-wide oversight, user verification, stock control, and analytics.15 |

Role-based access control (RBAC) is enforced through NextAuth.js (Auth.js) middleware, ensuring that JWT (JSON Web Tokens) are utilized to maintain session security.16 Sessions are stored in HttpOnly cookies to protect against cross-site scripting (XSS) attacks, while CSRF (Cross-Site Request Forgery) protection is integrated into the API route handlers.17

### **National Identity (NID) Verification Protocol**

Following the initial login, the system mandates the submission of a National Identity (NID) photo for verification.14 This step is a prerequisite for any further interaction with the donation or receiving modules.12 The verification workflow is designed to reduce the risk of fraudulent accounts and ensure that only legitimate individuals can access sensitive medical resources.1

The NID verification process encompasses the following stages:

1. **Image Capture and Submission**: Users upload a clear photograph of their NID. The system provides immediate feedback if the image is blurry, contains glare, or if the document corners are not fully visible.25  
2. **Automated Extraction (OCR)**: Using Optical Character Recognition (OCR), the system extracts the user’s name, ID number, and date of birth to compare against the profile data provided during signup.25  
3. **Liveness and Face Match**: If the platform incorporates biometric features, a live selfie is captured and compared against the photo on the NID to ensure the person performing the verification is the document's rightful owner.13  
4. **Administrative Triage**: Submissions are routed to an admin verification queue. While AI handles initial checks, an administrator must manually review and approve the document for high-risk or ambiguous cases.14  
5. **Status Transition**: Upon approval, the user’s status is updated to verified: true, which triggers the activation of the "Receive" or "Donate" dashboard options.14

## **Donor Module: Clinical Eligibility and Data Requirements**

The donor module is engineered to balance high user engagement with the uncompromising safety standards of transfusion medicine.5 To ensure a stable and safe supply of blood, the system collects comprehensive biographical and medical information.26

### **Core Data Clusters for Donors**

The donor profile includes mandatory fields essential for the operation of the matching engine and the maintenance of clinical safety.2

| Field Name | Type | Technical/Functional Utility |
| :---- | :---- | :---- |
| **Full Name** | String | Validated against the NID for legal accountability.20 |
| **Phone Number** | Numeric | Primary channel for SMS-based emergency notifications.1 |
| **Blood Group** | Enum | Categorized into A+, A-, B+, B-, AB+, AB-, O+, and O-.28 |
| **Location** | GeoJSON | Stores current coordinates or district data for proximity search.2 |
| **Last Donated** | Date | Used to calculate the 56-day (8-week) mandatory deferral interval.5 |
| **Age and Weight** | Numeric | Criteria for basic physiological eligibility (e.g., Min 18 years, Min 50kg).30 |

### **Medical History and Eligibility Logic**

The "other necessary information" for donors is structured as a medical history questionnaire that identifies potential risks to the donor or the recipient.30 This data is dynamic and must be updated before each donation session to reflect the donor's current health status.33

| Eligibility Topic | Standard Deferral Period | Clinical Justification |
| :---- | :---- | :---- |
| **Whole Blood Donation** | 56 Days (8 Weeks) | Allows for red blood cell regeneration.28 |
| **Tattoos/Piercings** | 3 \- 12 Months | Risk of blood-borne pathogen transmission.31 |
| **Recent Antibiotics** | Finish Course | Ensures infection has been fully resolved.34 |
| **Malaria Exposure** | 3 Months \- 3 Years | Travel to or residence in endemic regions.31 |
| **Pregnancy** | Duration of Pregnancy \+ 6 Weeks | Protection of maternal and fetal health.32 |
| **Recent Transfusion** | 3 Months | Risk of antibody development or infection.31 |

The system uses this data to automatically calculate an "Eligibility Score" and the "Next Available Donation Date," which is prominently displayed on the donor dashboard.5

## **Receiver Module: Clinical Demand and Triage**

The receiver module facilitates the critical communication of blood needs from individuals, hospitals, and medical staff.6 The system is designed to handle both planned surgical requirements and life-threatening emergencies through a triage-based request form.21

### **Blood Request Specifications**

Receivers provide data that allows the admin and matching engine to prioritize resources based on urgency and clinical necessity.21

| Field Name | Type | Clinical Context |
| :---- | :---- | :---- |
| **Patient Name** | String | Essential for hospital-side cross-matching and identification.20 |
| **Phone Number** | Numeric | Contact for the patient's representative or attending physician.20 |
| **Blood Group** | Enum | The specific type required (ABO and Rh factor).28 |
| **Location** | String | Hospital name, ward, and bed number for delivery logistics.21 |
| **Units Required** | Numeric | Volume specified in standard units (approx. 450ml per unit).20 |
| **Reason for Need** | Text | Description of the surgery, trauma, or chronic condition (e.g., Thalassemia).15 |
| **Urgency Level** | Enum | Routine, Urgent (needed within 1 hour), or STAT (Emergency).36 |

### **Request Lifecycle and Fulfillment**

Once a request is submitted, it enters the administrative queue for validation.15 For "Routine" requests, the system cross-references available stock in the database.5 In "STAT" cases, the matching engine immediately identifies all eligible donors within a specified radius (e.g., 5-10km) and triggers a multi-channel notification alert including SMS, email, and push notifications.1

The status of the request is tracked in real-time on the receiver's dashboard:

* **Pending**: The request is awaiting administrative review or donor matching.15  
* **Approved**: The request has been verified, and donors have been contacted or stock has been reserved.15  
* **In-Transit**: The blood units are moving from the donor/bank to the patient's location.5  
* **Fulfilled**: The transfusion has been successfully completed.5

## **The Intelligent Matching Engine**

The matching engine represents the computational core of the platform, utilizing a series of algorithms to optimize the pairing of donors with receivers.2 The logic incorporates biological, geographic, and temporal variables to ensure the fastest and safest possible match.2

### **Biological Compatibility Logic**

The engine adheres strictly to the ABO and RhD compatibility matrices to prevent adverse transfusion reactions.28

| Recipient Type | Compatible Red Cell Donor Types | Compatible Plasma Donor Types |
| :---- | :---- | :---- |
| **A+** | A+, A-, O+, O- | A, AB |
| **A-** | A-, O- | A, AB |
| **B+** | B+, B-, O+, O- | B, AB |
| **B-** | B-, O- | B, AB |
| **AB+** | Universal Recipient (All Types) | AB Only |
| **AB-** | AB-, A-, B-, O- | AB Only |
| **O+** | O+, O- | Universal Recipient (O, A, B, AB) |
| **O-** | O- Only | Universal Recipient (O, A, B, AB) |

The system automatically filters out incompatible donors, reducing the cognitive load on administrators and medical staff during emergencies.5

### **Proximity and Decision Support**

The integration of a Decision Support System (DSS) allows for the weighting of factors beyond blood type.2

1. **Distance Calculation**: The engine uses the Haversine formula or Mapbox/Google Maps API integrations to calculate the real-time travel distance between a donor’s last known location and the receiver’s hospital.2  
2. **Donor Reliability Score**: Regular donors with a history of successful fulfillment are prioritized in the matching queue.8  
3. **Stock Availability**: The engine first checks for processed units in the bank's stock before soliciting active donors to minimize delays.5

## **Administrative Control and Data Seeding**

The administrator serves as the system's governor, managing user roles, verifying identities, and overseeing the overall supply chain of blood resources.5

### **Seeding Protocols for System Reliability**

To facilitate testing and initial deployment, the platform includes a database seeding module.43 This script is designed to populate the MongoDB collections with foundational data, ensuring that the system is operational from the moment of initialization.18

The seed script performs the following actions:

* **Admin Creation**: Seeds a primary superuser account with unrestricted access to the management panel.15  
* **Role and Capability Mapping**: Establishes the RBAC schema, defining what donors, receivers, and junior admins can and cannot do.16  
* **Sample User Profiles**: Creates a diverse set of test donors and receivers with varying blood groups and historical data to validate the matching engine.43  
* **Initial Stock Data**: Populates the inventory with "dummy" blood units, complete with collection dates and expiration timestamps for stock management testing.5

### **Admin Dashboard and Management Features**

The admin panel is a comprehensive oversight tool that provides actionable insights through a series of specialized widgets and lists.19

| Feature Module | Admin Capabilities | Strategic Outcome |
| :---- | :---- | :---- |
| **Verification Queue** | Manual review of NID photos and profile data.14 | Ensures system integrity and user trust.12 |
| **Donor Management** | View, edit, or defer donors based on new health data.5 | Maintains a healthy and eligible donor pool.5 |
| **Inventory Monitor** | Real-time tracking of units by group and location.15 | Prevents stock-outs and minimizes wastage.5 |
| **Request Oversight** | Reviewing and approving donor-recipient matches.15 | Facilitates rapid and safe blood distribution.5 |
| **Analytics Engine** | Visualization of donation trends and demand peaks.22 | Enables proactive planning for seasonal shortages.22 |

## **Role-Specific Dashboard UX/UI Design**

The user interface is tailored to the specific psychological and operational needs of each role, prioritizing ease of use and clarity of information.10

### **Donor Dashboard Components**

The donor dashboard focuses on motivation, eligibility, and scheduling.8

* **Impact Visualization**: A graphic representation (e.g., a "Lives Saved" counter) that transforms abstract donation data into a sense of personal achievement.8  
* **Eligibility Countdown**: A visual timer indicating exactly how many days remain until the next eligible donation date.5  
* **Nearby Needs**: A list of urgent blood requests within a 5-10km radius, allowing for immediate action.11  
* **Appointment Manager**: A simplified calendar interface for booking donation sessions at local clinics or mobile drives.2

### **Receiver Dashboard Components**

The receiver dashboard emphasizes transparency, speed, and status tracking.6

* **Request Status Tracker**: A step-by-step progress bar showing the lifecycle of an active request from submission to fulfillment.15  
* **Notification Center**: Real-time alerts when a match is found or when blood units are issued from the bank.1  
* **Emergency Shortcut**: A prominent button for "STAT" requests that bypasses secondary fields for rapid submission.36  
* **Document Upload**: An interface for providing necessary medical requisitions or hospital authorization forms.21

### **Admin "Mission Control" Dashboard**

The admin interface is a high-density data environment designed for decision-making.15

* **Global Stock Overview**: Donut or bar charts displaying blood group availability relative to set safety targets.22  
* **Urgency Feed**: A live stream of incoming blood requests, color-coded by urgency level (e.g., Red for STAT, Yellow for Urgent).21  
* **User Verification Widget**: A count card showing the number of pending NID approvals, providing a shortcut to the verification queue.14  
* **Geospatial Map**: An interactive map showing the real-time distribution of donors and active requests across the region.2

## **Non-Functional Requirements and Security Engineering**

Given the sensitive nature of the information handled—National IDs and medical histories—the system's non-functional requirements are as critical as its core features.20

### **Security and Data Privacy**

The platform implements a "Defense in Depth" strategy to protect user data from unauthorized access and malicious attacks.17

1. **Input Validation**: Strict schema validation using libraries like Joi or yup is applied to every API request to block NoSQL injection and XSS attempts.17  
2. **Encryption Protocols**: All PII (Personally Identifiable Information), including NID numbers and medical notes, are encrypted at the field level within MongoDB using ![][image2].49  
3. **Secure Headers**: The helmet middleware is utilized in the backend to set various HTTP headers that prevent clickjacking and sniffing attacks.17  
4. **Rate Limiting**: To mitigate brute-force attacks on the signup and login pages, the system employs request throttling.17

### **Scalability and High Availability**

The blood management system must remain operational during mass-casualty events or natural disasters.5

* **Database Scalability**: MongoDB Atlas provides horizontal scaling through sharding and vertical scaling through cluster tier upgrades, ensuring the system can handle sudden surges in user activity.3  
* **CDN Integration**: Next.js applications are deployed on Vercel or similar platforms that utilize Edge Networks to serve static assets with minimal latency.7  
* **Disaster Recovery**: Automated, geographically redundant backups are scheduled daily to ensure no medical records or donation histories are lost in the event of a regional server failure.24

## **Regulatory Compliance and Ethical Governance**

Developing a healthcare application requires strict adherence to legal frameworks designed to protect patient and donor rights.51

### **Compliance Frameworks**

The system is designed to meet the rigorous standards of HIPAA (in the US context) and GDPR (in the EU context), which serve as global benchmarks for healthcare data privacy.52

| Regulation | Implementation Detail |
| :---- | :---- |
| **HIPAA** | Implementation of strict audit logs that record every instance of PHI (Protected Health Information) access.50 |
| **GDPR** | Granting users the "Right to be Forgotten" through an account deactivation and data purging module.52 |
| **Privacy Rule** | Requiring explicit, documented consent from donors before processing their health data for matching.52 |

### **Ethical Use of Data**

The system enforces the principle of data minimization, collecting only the "minimum necessary" information to perform its lifesaving functions.50 NID photos, once used to verify a user's identity, are stored in encrypted, non-publicly accessible buckets, and access is restricted to senior administrators only.23 The platform prohibits the sale or sharing of donor data with third-party marketing entities, maintaining a commitment to donor confidentiality.57

## **Conclusion: A Convergent Vision for Blood Logistics**

The requirement specification for this blood donation and receiving platform represents a synthesis of technical excellence and medical necessity.1 By utilizing the MERN stack and Next.js, the system achieves the responsiveness and reliability required for a critical healthcare intervention.3 The multi-role architecture—encompassing verified donors, clinically motivated receivers, and administratively empowered governors—creates a closed-loop ecosystem where supply is dynamically matched with demand through intelligent algorithms.5 As the system evolves, the integration of real-time geospatial tracking and automated clinical eligibility checks will continue to reduce the friction inherent in blood logistics, ultimately fulfilling the platform’s primary mission: to ensure that no patient suffers due to the lack of accessible, safe, and compatible blood resources.2

#### **Works cited**

1. BLOOD BANK MANAGEMENT SYSTEM \- SciSpace, accessed on March 6, 2026, [https://scispace.com/pdf/blood-bank-management-system-l2n0cg9d.pdf](https://scispace.com/pdf/blood-bank-management-system-l2n0cg9d.pdf)  
2. Design and Implementation of an Online Blood ... \- Amazon AWS, accessed on March 6, 2026, [https://sdiopr.s3.ap-south-1.amazonaws.com/2024/Feb/17-Feb-24/2024\_AJRCOS\_112749/Revised-ms\_AJRCOS\_112749\_v1.pdf](https://sdiopr.s3.ap-south-1.amazonaws.com/2024/Feb/17-Feb-24/2024_AJRCOS_112749/Revised-ms_AJRCOS_112749_v1.pdf)  
3. MERN Stack Explained \- MongoDB, accessed on March 6, 2026, [https://www.mongodb.com/resources/languages/mern-stack](https://www.mongodb.com/resources/languages/mern-stack)  
4. Transforming Healthcare: Building an Advanced Web Application with the MERN Stack, accessed on March 6, 2026, [https://ijiccs.in/p3v3.pdf](https://ijiccs.in/p3v3.pdf)  
5. What is a Blood Bank Management System? SBS \- Superior Business Solutions, accessed on March 6, 2026, [https://sbs-me.com/blood-bank-management-system/](https://sbs-me.com/blood-bank-management-system/)  
6. suraj-savle/blood-bank-management-system \- GitHub, accessed on March 6, 2026, [https://github.com/suraj-savle/blood-bank-management-system](https://github.com/suraj-savle/blood-bank-management-system)  
7. Why MERN Stack Developers Should Learn Next.js | by Jhonsonsannie | Medium, accessed on March 6, 2026, [https://medium.com/@jhonsonsannie/why-mern-stack-developers-should-learn-next-js-560218338d08](https://medium.com/@jhonsonsannie/why-mern-stack-developers-should-learn-next-js-560218338d08)  
8. Case study: Improving blood donors' digital experience on mobile app \- UX Planet, accessed on March 6, 2026, [https://uxplanet.org/improving-donors-experience-on-australian-red-cross-lifeblood-mobile-app-8af2176f0ae1](https://uxplanet.org/improving-donors-experience-on-australian-red-cross-lifeblood-mobile-app-8af2176f0ae1)  
9. Role-based authorization using NextAuth and Next.js server actions | Alamin Shaikh, accessed on March 6, 2026, [https://www.alaminshaikh.com/blog/role-based-authorization-using-nextauth-and-nextjs-server-actions](https://www.alaminshaikh.com/blog/role-based-authorization-using-nextauth-and-nextjs-server-actions)  
10. 10 UI Components That Will Elevate Your Admin Dashboard Design \- Bootstrap Dash., accessed on March 6, 2026, [https://www.bootstrapdash.com/blog/admin-dashboard-ui-components](https://www.bootstrapdash.com/blog/admin-dashboard-ui-components)  
11. IoT Based E-Blood Bank System for Real Time Hospital Monitoring and Inventory Management \- ResearchGate, accessed on March 6, 2026, [https://www.researchgate.net/publication/392222512\_IoT\_Based\_E-Blood\_Bank\_System\_for\_Real\_Time\_Hospital\_Monitoring\_and\_Inventory\_Management](https://www.researchgate.net/publication/392222512_IoT_Based_E-Blood_Bank_System_for_Real_Time_Hospital_Monitoring_and_Inventory_Management)  
12. 7 Best Practices for Implementing Identity Verification \- Hirsch, accessed on March 6, 2026, [https://www.hirschsecure.com/resources/blog/7-best-practices-for-implementing-identity-verification](https://www.hirschsecure.com/resources/blog/7-best-practices-for-implementing-identity-verification)  
13. Identity Proofing Best Practice \- IDManagement.gov, accessed on March 6, 2026, [https://www.idmanagement.gov/experiments/pid/bestpractice/](https://www.idmanagement.gov/experiments/pid/bestpractice/)  
14. Standard Identity Verification Workflow \- Incode Developer Hub, accessed on March 6, 2026, [https://developer.incode.com/docs/common-id-validation-workflow](https://developer.incode.com/docs/common-id-validation-workflow)  
15. pratyushsrivastava500/Blood-Bank-Management-System: A comprehensive web-based application to streamline blood donation, inventory and request management, developed using a modern tech stack including Django (Python), SQLite3, Bootstrap, HTML/CSS, and JavaScript. \- GitHub, accessed on March 6, 2026, [https://github.com/pratyushsrivastava500/Blood-Bank-Management-System](https://github.com/pratyushsrivastava500/Blood-Bank-Management-System)  
16. Implementing Role-Based Access Control in Next.js, Next-Auth with Prisma and MongoDB, accessed on March 6, 2026, [https://medium.com/@chsherryy/implementing-role-based-access-control-in-next-js-next-auth-with-prisma-and-mongodb-324f1929cf93](https://medium.com/@chsherryy/implementing-role-based-access-control-in-next-js-next-auth-with-prisma-and-mongodb-324f1929cf93)  
17. Security Best Practices in MERN Stack (2025 Guide) \- C\# Corner, accessed on March 6, 2026, [https://www.c-sharpcorner.com/article/security-best-practices-in-mern-stack-2025-guide/](https://www.c-sharpcorner.com/article/security-best-practices-in-mern-stack-2025-guide/)  
18. Role Based Access Control \- Auth.js, accessed on March 6, 2026, [https://authjs.dev/guides/role-based-access-control](https://authjs.dev/guides/role-based-access-control)  
19. Blood Bank Management System | Ezovion Healthcare, accessed on March 6, 2026, [https://ezovion.com/practice-management/blood-bank-management-system/](https://ezovion.com/practice-management/blood-bank-management-system/)  
20. Blood Bank Management System SRS | PDF | Blood Donation | Use Case \- Scribd, accessed on March 6, 2026, [https://www.scribd.com/document/714794308/Blood-bank-management-system](https://www.scribd.com/document/714794308/Blood-bank-management-system)  
21. Blood Request Form | PDF \- Scribd, accessed on March 6, 2026, [https://www.scribd.com/document/916563886/Blood-Request-Form](https://www.scribd.com/document/916563886/Blood-Request-Form)  
22. Blood Bank Collection & Donation Drive Dashboard Template \- Mokkup.ai, accessed on March 6, 2026, [https://www.mokkup.ai/templates/blood-bank-collection-donation-drive-dashboard-template/](https://www.mokkup.ai/templates/blood-bank-collection-donation-drive-dashboard-template/)  
23. Secure MERN Web Apps with These Proven Security Best Practices | by Mukesh Ram, accessed on March 6, 2026, [https://medium.com/@mukesh.ram/secure-mern-web-apps-with-these-proven-security-best-practices-3e63b21aa8af](https://medium.com/@mukesh.ram/secure-mern-web-apps-with-these-proven-security-best-practices-3e63b21aa8af)  
24. 2026 Guide: Best Practices for User Verification \- FastPass, accessed on March 6, 2026, [https://www.fastpasscorp.com/best-practices-for-user-verification/](https://www.fastpasscorp.com/best-practices-for-user-verification/)  
25. Best Identity Verification Practices for Secure Onboarding | Ondato, accessed on March 6, 2026, [https://ondato.com/blog/identity-verification-best-practices/](https://ondato.com/blog/identity-verification-best-practices/)  
26. Blood Bank Management System (BBMS) | PDF | Blood Donation ..., accessed on March 6, 2026, [https://www.scribd.com/document/408508426/Blood-Bank-Management-System-BBMS](https://www.scribd.com/document/408508426/Blood-Bank-Management-System-BBMS)  
27. Security Features in Blood Bank System | PDF | Business | Finance & Money Management, accessed on March 6, 2026, [https://www.scribd.com/document/684493594/Software-Requirements-Specification-Functional-Requirements](https://www.scribd.com/document/684493594/Software-Requirements-Specification-Functional-Requirements)  
28. Blood Safety and Matching \- Hematology.org, accessed on March 6, 2026, [https://www.hematology.org/education/patients/blood-basics/blood-safety-and-matching](https://www.hematology.org/education/patients/blood-basics/blood-safety-and-matching)  
29. Blood Types Explained \- A, B, AB and O | Red Cross Blood Services, accessed on March 6, 2026, [https://www.redcrossblood.org/donate-blood/blood-types.html](https://www.redcrossblood.org/donate-blood/blood-types.html)  
30. Annex 2 Example of a blood donor questionnaire \- NCBI, accessed on March 6, 2026, [https://www.ncbi.nlm.nih.gov/books/NBK138214/bin/annex2-fm1.pdf](https://www.ncbi.nlm.nih.gov/books/NBK138214/bin/annex2-fm1.pdf)  
31. Blood Donor Eligibility Explained \- ConnectLife, accessed on March 6, 2026, [https://www.connectlife.org/post/blood-donor-eligibility-explained](https://www.connectlife.org/post/blood-donor-eligibility-explained)  
32. Medical History Questionnaire \- Stanford Blood Center, accessed on March 6, 2026, [https://stanfordbloodcenter.org/medical-history-questionnaire/](https://stanfordbloodcenter.org/medical-history-questionnaire/)  
33. Sequence Diagram for Blood Bank Management System | Creately, accessed on March 6, 2026, [https://creately.com/diagram/example/ib96s7tk/sequence-diagram-for-blood-bank-management-system](https://creately.com/diagram/example/ib96s7tk/sequence-diagram-for-blood-bank-management-system)  
34. Eligibility Criteria Alphabetical Listing \- Donate Blood, accessed on March 6, 2026, [https://www.redcrossblood.org/donate-blood/how-to-donate/eligibility-requirements/eligibility-criteria-alphabetical.html](https://www.redcrossblood.org/donate-blood/how-to-donate/eligibility-requirements/eligibility-criteria-alphabetical.html)  
35. Grifols Donation Consumer Health Data Privacy Policy, accessed on March 6, 2026, [https://www.grifols.com/documents/6155530/6442049/Grifols\_Plasma\_CHD\_Policy\_Washington\_Nevada\_Mar2024.pdf/7579d37b-9b28-9b6f-a844-bc8f33b72284?t=1712739593571](https://www.grifols.com/documents/6155530/6442049/Grifols_Plasma_CHD_Policy_Washington_Nevada_Mar2024.pdf/7579d37b-9b28-9b6f-a844-bc8f33b72284?t=1712739593571)  
36. HPM.1.1 Request Special Types of Red Blood Cells, accessed on March 6, 2026, [https://www.lifesouth.org/wp-content/uploads/2018/09/Request\_Special\_Types\_of\_Red\_Blood\_Cells.pdf](https://www.lifesouth.org/wp-content/uploads/2018/09/Request_Special_Types_of_Red_Blood_Cells.pdf)  
37. Request for Blood & Blood Components, accessed on March 6, 2026, [https://bloodworksnw.org/pdf/19-9-034\_06.pdf](https://bloodworksnw.org/pdf/19-9-034_06.pdf)  
38. Customer Service Manual \- We Are Blood, accessed on March 6, 2026, [https://weareblood.org/wp-content/uploads/2016/10/CS-Manual-2015.pdf](https://weareblood.org/wp-content/uploads/2016/10/CS-Manual-2015.pdf)  
39. Blood Transfusion Policies Manual \- Department of Pathology \- University of Michigan, accessed on March 6, 2026, [https://www.pathology.med.umich.edu/blood-bank/procedure-for-transfusing-blood-during-an-emergency](https://www.pathology.med.umich.edu/blood-bank/procedure-for-transfusing-blood-during-an-emergency)  
40. Sequence diagram starting from the blood donation to the blood transfusion \- ResearchGate, accessed on March 6, 2026, [https://www.researchgate.net/figure/Sequence-diagram-starting-from-the-blood-donation-to-the-blood-transfusion\_fig2\_221451217](https://www.researchgate.net/figure/Sequence-diagram-starting-from-the-blood-donation-to-the-blood-transfusion_fig2_221451217)  
41. ER diagram for Blood Bank System | EdrawMax Templates, accessed on March 6, 2026, [https://www.edrawmax.com/templates/1066308/](https://www.edrawmax.com/templates/1066308/)  
42. 5 Type Blood Compatibility Charts for Safe Donation and Receiving \- Liv Hospital, accessed on March 6, 2026, [https://int.livhospital.com/blood-compatibility-chart/](https://int.livhospital.com/blood-compatibility-chart/)  
43. How to seed roles and capabilities in MongoDB \- Stack Overflow, accessed on March 6, 2026, [https://stackoverflow.com/questions/65578085/how-to-seed-roles-and-capabilities-in-mongodb](https://stackoverflow.com/questions/65578085/how-to-seed-roles-and-capabilities-in-mongodb)  
44. Must-have Donor Dashboard Templates With Examples and Samples \- SlideTeam, accessed on March 6, 2026, [https://www.slideteam.net/blog/must-have-donor-dashboard-templates-with-examples-and-samples](https://www.slideteam.net/blog/must-have-donor-dashboard-templates-with-examples-and-samples)  
45. UI/UX Design of Mobile Platform-Based Blood Donor Application Using User Centered Design Method, accessed on March 6, 2026, [https://www.globalresearcher.net/index.php/technovate/article/download/79/70](https://www.globalresearcher.net/index.php/technovate/article/download/79/70)  
46. (PDF) Optimizing the Blood Donation App with Gamification Using User-Centered Design, accessed on March 6, 2026, [https://www.researchgate.net/publication/377518409\_Optimizing\_the\_Blood\_Donation\_App\_with\_Gamification\_Using\_User-Centered\_Design](https://www.researchgate.net/publication/377518409_Optimizing_the_Blood_Donation_App_with_Gamification_Using_User-Centered_Design)  
47. HIPAA Compliant Forms \- Jotform, accessed on March 6, 2026, [https://www.jotform.com/hipaa/](https://www.jotform.com/hipaa/)  
48. Dashboard Widget Examples | MyOneTrust, accessed on March 6, 2026, [https://my.onetrust.com/s/article/UUID-95c03c0c-fdfa-54b4-a698-eb5d4fd43016?language=en\_US](https://my.onetrust.com/s/article/UUID-95c03c0c-fdfa-54b4-a698-eb5d4fd43016?language=en_US)  
49. Best Practices for Securing MERN Stack Applications: A Comprehensive Study of Authentication, Authorization and Data Protection \- Theseus, accessed on March 6, 2026, [https://www.theseus.fi/bitstream/10024/876758/2/Chowdhury\_Md\_Shahriar\_Nur.pdf](https://www.theseus.fi/bitstream/10024/876758/2/Chowdhury_Md_Shahriar_Nur.pdf)  
50. HIPAA Software Compliance Requirements for Web and Mobile Apps, accessed on March 6, 2026, [https://appitventures.com/blog/mobile-health-apps-and-hipaa-compliance](https://appitventures.com/blog/mobile-health-apps-and-hipaa-compliance)  
51. Comprehensive Guide to Develop Blood Bank App in 2023 \- QSS Technosoft, accessed on March 6, 2026, [https://www.qsstechnosoft.com/blog/healthcare-app-development-145/guide-to-develop-blood-bank-app-412](https://www.qsstechnosoft.com/blog/healthcare-app-development-145/guide-to-develop-blood-bank-app-412)  
52. Protect Patient Privacy: The Definitive Guide to GDPR Compliance for Healthcare Companies \- Kiteworks, accessed on March 6, 2026, [https://www.kiteworks.com/gdpr-compliance/patient-privacy-protection-best-practices/](https://www.kiteworks.com/gdpr-compliance/patient-privacy-protection-best-practices/)  
53. Build a HIPAA Compliant Website: HIPAA Compliance Checklist \- WeWeb, accessed on March 6, 2026, [https://www.weweb.io/blog/blog-hipaa-compliant-web-apps](https://www.weweb.io/blog/blog-hipaa-compliant-web-apps)  
54. Blood donor register privacy statement, accessed on March 6, 2026, [https://www.veripalvelu.fi/en/privacy-policy/blood-donor-register-privacy-statement/](https://www.veripalvelu.fi/en/privacy-policy/blood-donor-register-privacy-statement/)  
55. Privacy Policy \- We Are Blood, accessed on March 6, 2026, [https://weareblood.org/privacy-policy/](https://weareblood.org/privacy-policy/)  
56. Best way to store images in MERN stack web application, accessed on March 6, 2026, [https://stackoverflow.com/questions/62354249/best-way-to-store-images-in-mern-stack-web-application](https://stackoverflow.com/questions/62354249/best-way-to-store-images-in-mern-stack-web-application)  
57. Donor Privacy Policy | American Red Cross, accessed on March 6, 2026, [https://www.redcross.org/privacy-policy/donor-privacy-policy.html](https://www.redcross.org/privacy-policy/donor-privacy-policy.html)  
58. Privacy Policy \- Blood Bank of Hawaii, accessed on March 6, 2026, [https://www.bbh.org/privacy-policy/](https://www.bbh.org/privacy-policy/)

[image1]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADQAAAAZCAYAAAB+Sg0DAAAC+ElEQVR4Xu2Wz8uNQRTHj1BE+RmJECJSlIWIbCworBRlLRakKMqGkn+AKBJZCPlRFiIL3VBICbFRcklEoUSJwvdzz8x7Z+bep3eD7lvPtz51nzln5pk558x5rlmtWrX+hmaL1+KTaIiRmXUAaqw4I36LQ4WtlzVYLBWTSgN6ID6KuaWhRzVInDJPwrrC1tI3G1jlNsb6SQInPWh+8nGFrdRQ6zz4+DBe9RzXLeeV6vb+0WE81SLzJFwXwwtby/mXOCpemmfqnBiV+KB54pr4LD6IO2KKud998VWsERvMX/RGLGvN9PXeiR9iVxhDHPCKGGYegCPiWfCZI26Jh+KJeSYYe2+egBQO2CdeysT0AK9EU0wOz0w6bu2oY2dsh7ghFogv4oWYLh4H+1axxDyK882Dcc/a2hL8hojTYpV5ORH9xYkfNvxWh2cOTcAIaIdYlHJLhTOLcvJZ5hthQ1F0FwIxU2wTmyzvkszBTieKm9gTfPBHHOKieXWMCOOUG+9sWF6e+DF3e3j+Ka6aZzZTXHRlMc5LKJEZYr9VTE7EQSo7jnn2yUwaGLLfDKTqFmAywvprwzO/CVCHuLw4l6ljQsPczmH2ZtZO0XFiALqJbJVRJYgEjoBGxXYcsxrF3NjRSALP8X5m4qPEfUjTS73H+me8Ye3IVKm/tr/TfM00MLEE00jHAJeBwe+s+WFiZuP95l73dUYcToiJ4XmaeG55xpaLA5a3zt3mJYQ/ItJl2abaaPnm6WI8s3kOERWbRCxLNkszStfm977wm7tKl8zE5p+K8+ad6nBubh2E2r9tvvhN88sZ+z9ZaVo7Yt2E70nxXVyw9p2gvGKg0iZBU+LvGMG9G+xR3EfK+7J4JBbmZhcpo/yqLj6RIov48KErVVVqpZjLGrGJkLmotEmwj6p3IfY7wbyL/neRAT6om5Oxt+ZVwaaiYpOgcfS0KLdLYqp5l6LmV2QeZsfMy4is8aHu+g+6l0R34w5yL9YXNsRYSsf/s1q1av17/QE+Da3L3WraUgAAAABJRU5ErkJggg==>

[image2]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAF8AAAAZCAYAAABXTfKEAAAEIklEQVR4Xu2YW6hOWxTHh1wi5Jpc2+RSJPdLhOPB5ZRLOc7bkZRCUsoD8aS8eEJuRaSTxEF4QHGkL0Ty4ChSLg+k5AglTh1yGb/Gmr6x5rfWtze1F2X96t/+5lxzrTXXmGOOMeYWKSkpKfkhaa3qE3c2A71UnV27o6qFa/+ULFLNizsdGGyzam8jYow3bqCv6qjqieql6oHqF9UhVSs3rgiY3xTVYFXb6Br0VrWM+tqrukV9njFiz8OJv4oeqtuqNfEFBy+fo3qr+qTapfrdaa2qonok5t2ecap/VduSNp4+O+mr987moKvquZgTfBD7Fr7NU1G9UZ0Sc6j9qneq+W5MoKfqhOovsfv+UTX4AfUYrbqe6M/oWhZM9o6qe3wh4bikPXmj2IKNdX0BdloRoS7wq+qZpL1zuOpjci1wVqo7ebtkR4QOqvOq+6p+SR/2wz5nwqB6MAlWjJCzQZpu/ANSjdN4DQsY2vuSv4HLYl5G2Inho4oMOevE5u8dgZxDH0YO4PFZzuL5TWzR/H1DVFtUI1xfLmyj02KryMQqye88uohN9A/XxzNCOIEV7jcQhrhnidQm1qFRu7mZKRZqvCPwvczPO15TjM8O5z4W4Zu4qJqa/OYhFalvfIwVh5ALkl6MGLYgk0Q3VQOlNpkVSRzfCZ/MDecLYPwJYjlut5h3x3N+qHovFq62qv5THZbsHV7DIFV/1x4v+eEhwCRYsJBkl6puiO2IegxTHRFLWmEh8EA88XvSSXVJtTDqP5fRx5w3SXX3hsJjp+ujgmJBWIRciLMkEw/eHHu1BwNj6NjLfcxjErGHeLi+WqoTj/NDDOMp76ieGhPj4rBWD/IdNsAhmgJzxjkHuHYcdoINX7i+Ggg1/0vVC4PYOuyALEaqXid/Pb78mqRq59p5IWyV1MbZLDDo36rHTdAxyX9fDItEacx5Y0Z0LY+nYgk2jMcWvg04QchxmTBBtlW85bmRm7LKKsDjuZ4XYvigHVGf3xUe3sGz8q43N4SUe6pRSZtyd2Lym+/Ac5cl7UAwarAPMT921kaNTzXCoSE+iWVVMh5CRO5DxbbcNdemhKPMzIJ3xLV1kVwRy3kB5kOpDaH6Iem2+TLCwgnxnLgOodrxzkpBwsIxLgXGptpAWQcbTmo8bI+kF4YYjpEIU8jD0Xy52Gq/EjuwBIiFPG+y64ODYl7XEPUXAe/k3czLyxsVKmL2CBBKKRB8iA3/FSBhk7jZMeuTcalkHeJ1eBlGJD4DcfWWuxZESOAAFvfniQzvD0zcz25ha5KoSW7E+KuSrrKKJByyYuGt/syxUiy5Ml+iBP+Hmiu1CZ177ootwkmxb10steMKhd3C4rKDqKtniW1tytPvOrGvAKdcIDbv6elLKfjGaWLhh3tKSkpKSkpKSkpKiuAzdJj/5r2U8qgAAAAASUVORK5CYII=>