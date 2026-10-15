/**
 * Single source of truth for all site copy + contact details.
 * Everything here was taken from the approved UI design — confirm the
 * phone number, timings, qualifications and domain with the client before launch.
 */

export const SITE = {
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.drvijayachaitanya.com",
  name: "Dr. B. Vijaya Chaitanya",
  role: "Interventional Cardiologist",
  tagline: "Better Hearts. Healthier Lives.",
  titles: [
    "Managing Director, Medstar Hospitals",
    "Chief of Cardiovascular Sciences",
    "Interventional Cardiologist",
  ],
  hospital: "Medstar Hospitals",
  city: "Vijayawada",
  region: "Andhra Pradesh",
  country: "IN",
  phone: { display: "+91 98765 43210", tel: "+919876543210" },
  whatsapp: {
    number: "919876543210",
    display: "+91 98765 43210",
    message: "Hello Dr. B. Vijaya Chaitanya, I would like to enquire about a cardiology consultation.",
  },
  hours: { days: "Mon - Sat", time: "9:00 AM - 6:00 PM" },
  /** Paste a YouTube/Vimeo embed URL here to turn on the "Watch Introduction" video modal. */
  introVideoEmbedUrl: "",
  copyrightFrom: 2024,
} as const;

export const MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=Medstar+Hospitals+Vijayawada";

export const DESCRIPTION =
  "Dr. B. Vijaya Chaitanya is an interventional cardiologist, Managing Director of Medstar Hospitals and Chief of Cardiovascular Sciences in Vijayawada — specialising in complex coronary interventions, structural heart procedures, advanced cardiac imaging and peripheral vascular interventions.";

export const NAV = [
  { label: "Home", href: "#home", id: "home" },
  { label: "Experience", href: "#experience", id: "experience" },
  { label: "Clinical Expertise", href: "#expertise", id: "expertise" },
  { label: "About", href: "#about", id: "about" },
  { label: "Journey", href: "#journey", id: "journey" },
  { label: "FAQ", href: "#faq", id: "faq" },
  { label: "Contact", href: "#contact", id: "contact" },
] as const;

export const HERO_STATS = [
  { value: "26,000+", label: "Angiograms" },
  { value: "12,000+", label: "Angioplasties" },
  { value: "11,000+", label: "Peripheral Interventions" },
] as const;

export const STATS = [
  { value: "26,000+", label: "Coronary Angiograms" },
  { value: "12,000+", label: "Coronary Angioplasties" },
  { value: "11,000+", label: "Peripheral Interventions" },
  { value: "300+", label: "Pacemaker Implantations" },
  { value: "100+", label: "ICD & CRT Device Implantations" },
] as const;

export const EXPERTISE = [
  {
    id: "coronary",
    title: "Complex Coronary Interventions",
    short: "Complex Coronary Interventions",
    description: "Advanced angioplasty and stenting techniques for complex coronary disease.",
  },
  {
    id: "structural",
    title: "Structural Heart Interventions",
    short: "Structural Heart Interventions",
    description: "Valve and structural procedures, including TAVI.",
  },
  {
    id: "imaging",
    title: "Advanced Cardiac Imaging",
    short: "Advanced Cardiac Imaging",
    description: "Clear cardiac imaging that guides clear decisions.",
  },
  {
    id: "peripheral",
    title: "Peripheral Vascular Interventions",
    short: "Peripheral Vascular Interventions",
    description: "Restoring healthy blood flow beyond the heart.",
  },
] as const;

export const FEATURES = [
  { id: "excellence", title: "Clinical Excellence", text: "Evidence-based care" },
  {
    id: "patient",
    title: "Patient-Centred Approach",
    text: "Individualised treatment plans",
  },
  {
    id: "leadership",
    title: "Healthcare Leadership",
    text: "Building stronger cardiovascular services",
  },
] as const;

/** Newest first — the timeline starts at the present and walks back through his training. */
export const JOURNEY = [
  {
    label: "Present",
    kind: "role",
    title: "Healthcare Leadership",
    details: ["Managing Director, Medstar Hospitals","Chief of Cardiovascular Sciences"],
  },
  {
    label: "Career",
    kind: "Career",
    title: "Leading Institutions",
    details: ["Consultant Cardiologist, Medanta Medicity Delhi NCR · Senior Consultant Cardiologist, Manipal Hospitals · Clinical experience at Jayadeva Institute of Cardiology, Bengaluru"],
  },
    {
    label: "Advanced",
    kind: "Advanced",
    title: "Interventional & Structural Heart Training",
    details: ["FIC · TAVI Fellowship, Medanta Delhi · Advanced training exposure at Mount Sinai, New York · FACC"],
  },
  { label: "2013", kind: "degree", title: "DM – Cardiology", details: ["Sri Ramachandra Medical College, Chennai"] },
  { label: "2009", kind: "degree", title: "MD – General Medicine", details: ["Rajiv Gandhi University , Karnataka"] },
  { label: "2005", kind: "degree", title: "MBBS", details: ["Rajiv Gandhi University, Karnataka"] },
] as const;

export const AWARDS = [
  { title: "Fellow of the American College of Cardiology", icon: "shield" },
  { title: "Fellowship in Interventional Cardiology", icon: "cross" },
  { title: "Specialised Training in TAVI", place: "Medanta, Delhi", icon: "heart" },
  { title: "Advanced Exposure", place: "Mount Sinai, New York", icon: "star" },
] as const;

export const SOCIALS = [
  { name: "Instagram", href: "https://www.instagram.com/medstarhospitalsofficial/", icon: "instagram" },
  { name: "Facebook", href: "https://www.facebook.com/medstarhospitalstadepalli/", icon: "facebook" },
  { name: "YouTube", href: "https://www.youtube.com/@medstar_hospitals", icon: "youtube" },
] as const;

export const SHOWCASE = [
  {
    id: "cathlab",
    title: "The Cath Lab",
    caption: "Precision and calm where complex cases are treated.",
  },
  {
    id: "heart",
    title: "The Heart, in Detail",
    caption: "Reading the anatomy before every decision.",
  },
  {
    id: "coronary",
    title: "Complex Coronary Interventions",
    caption: "Advanced angioplasty and stenting techniques.",
  },
  {
    id: "structural",
    title: "Structural Heart Interventions",
    caption: "Valve procedures including TAVI.",
  },
  {
    id: "imaging",
    title: "Advanced Cardiac Imaging",
    caption: "Clear images that guide clear decisions.",
  },
  {
    id: "peripheral",
    title: "Peripheral Vascular Interventions",
    caption: "Restoring flow beyond the heart.",
  },
  {
    id: "hospital",
    title: "Medstar Hospitals",
    caption: "Building a centre for cardiovascular care.",
  },
] as const;

export const EXERCISES = [
  {
    id: "walking",
    title: "Walking",
    text: "A simple and effective way to improve cardiovascular health, boost stamina and support overall well-being.",
  },
  {
    id: "cycling",
    title: "Cycling",
    text: "A low-impact exercise that helps improve heart function and endurance.",
  },
  {
    id: "stretching",
    title: "Gentle Stretching",
    text: "Improves flexibility, posture and helps you move comfortably in daily life.",
  },
  {
    id: "strength",
    title: "Strength Training",
    text: "Builds muscle strength, improves metabolism and supports long-term heart health.",
  },
] as const;

export const TIPS = [
  { id: "diet", title: "Balanced Diet", text: "Fuel your heart with the right nutrition." },
  { id: "sleep", title: "Better Sleep", text: "Quality sleep supports a healthier heart." },
  { id: "active", title: "Stay Active", text: "Make movement a part of your daily routine." },
  { id: "stress", title: "Manage Stress", text: "A calm mind supports a healthier heart." },
] as const;
