export interface ClinicalProcedure {
  id: string;
  number: string;
  title: string;
  summary: string;
  seoTitle: string;
  metaDescription: string;
  articleTitle: string;
  paragraphs: string[];
  category?: string;
}

export const CLINICAL_PROCEDURES: ClinicalProcedure[] = [
  {
    id: "structural-heart",
    number: "01",
    title: "Structural Heart Interventions",
    summary:
      "Catheter-based treatments for heart valves and other internal heart structures including TAVI, TAVR and transcatheter mitral valve procedures.",
    seoTitle: "Structural Heart Interventions in Vijayawada | Dr. B. Vijaya Chaitanya",
    metaDescription:
      "Learn about catheter-based structural heart treatments, including TAVI, TAVR and transcatheter mitral valve procedures, with Dr. B. Vijaya Chaitanya in Vijayawada.",
    articleTitle: "Structural Heart Interventions: Treating the Heart Beyond Its Arteries",
    paragraphs: [
      "The heart is more than a pump. Its valves and internal structures play an essential role in maintaining healthy blood circulation. When these structures become diseased, treatment may require specialised expertise beyond conventional coronary intervention.",
      "Structural heart interventions use catheter-based techniques to treat selected conditions affecting the heart valves and other internal structures. Depending on the diagnosis, anatomy and individual risk profile, these approaches may offer an alternative to conventional open-heart surgery.",
      "Dr. B. Vijaya Chaitanya's cardiovascular expertise includes structural heart interventions, supported by specialised training in transcatheter aortic valve implantation (TAVI).",
      "Understanding the condition, evaluating available treatment options and determining whether a catheter-based procedure is appropriate are essential steps in planning care.",
      "The objective is to identify the most suitable treatment for the individual patient, based on clinical assessment and established medical evidence.",
    ],
  },
  {
    id: "tavi-tavr",
    number: "02",
    title: "TAVI / TAVR",
    summary:
      "Minimally invasive aortic valve replacement for severe aortic valve disease, with careful patient assessment and individualised treatment planning.",
    seoTitle: "TAVI / TAVR Treatment in Vijayawada | Dr. B. Vijaya Chaitanya",
    metaDescription:
      "Understand TAVI/TAVR for severe aortic valve disease, patient suitability and transcatheter valve replacement with Dr. B. Vijaya Chaitanya.",
    articleTitle: "TAVI / TAVR: A Catheter-Based Approach to Aortic Valve Replacement",
    paragraphs: [
      "When the aortic valve becomes severely narrowed, the heart must work harder to pump blood throughout the body. This condition, known as aortic stenosis, can cause breathlessness, chest discomfort, dizziness and reduced physical capacity.",
      "Transcatheter Aortic Valve Implantation (TAVI), also known as Transcatheter Aortic Valve Replacement (TAVR), is a minimally invasive procedure in which a replacement valve is delivered through a catheter, commonly through an artery in the groin.",
      "Unlike conventional open-heart valve replacement, TAVI does not typically require opening the chest. However, it is not suitable for every patient.",
      "Dr. B. Vijaya Chaitanya has undertaken specialised TAVI fellowship training at Medanta, Delhi. Assessment for TAVI involves evaluating valve severity, anatomy, overall health, procedural risks and alternative treatment options.",
      "A multidisciplinary heart team determines the most appropriate approach for each patient.",
    ],
  },
  {
    id: "tmvr",
    number: "03",
    title: "Transcatheter Mitral Valve Replacement (TMVR)",
    summary:
      "Catheter-based valve replacement for mitral valve disease, with specialist assessment to determine suitability and the most appropriate treatment.",
    seoTitle: "Transcatheter Mitral Valve Replacement | Vijayawada",
    metaDescription:
      "Explore transcatheter mitral valve replacement, treatment considerations for mitral valve disease and specialist cardiovascular assessment in Vijayawada.",
    articleTitle: "Transcatheter Mitral Valve Replacement: Exploring Less Invasive Valve Treatment",
    paragraphs: [
      "The mitral valve regulates blood flow between the left atrium and left ventricle. When it becomes severely diseased, the resulting obstruction or leakage can affect the heart's efficiency and a patient's quality of life.",
      "Transcatheter Mitral Valve Replacement (TMVR) is an evolving treatment approach in which a replacement valve is delivered using a catheter rather than through conventional open-heart surgery. Its suitability depends on the type of mitral valve disease, the patient's anatomy, previous procedures and overall clinical condition.",
      "Not every patient with mitral valve disease is a candidate for TMVR. Other options, including surgical repair, surgical replacement or selected catheter-based repair procedures, may be more appropriate.",
      "Careful imaging, specialist assessment and multidisciplinary planning are essential to determine which treatment offers the most appropriate balance of benefit and risk.",
    ],
  },
  {
    id: "primary-angioplasty",
    number: "04",
    title: "Primary Angioplasty for Acute Heart Attacks",
    summary:
      "Emergency procedure to reopen blocked coronary arteries, restore blood flow and reduce damage to the heart muscle.",
    seoTitle: "Primary Angioplasty for Heart Attack | Dr. Vijaya Chaitanya, Vijayawada",
    metaDescription:
      "Learn how primary PCI treats acute heart attacks, why time matters and how emergency coronary intervention restores blood flow.",
    articleTitle: "Primary Angioplasty: When Every Minute Matters",
    paragraphs: [
      "A heart attack occurs when blood flow to part of the heart muscle is severely reduced or blocked, usually because of a clot in a coronary artery. Without timely treatment, the affected heart muscle can sustain permanent damage.",
      "Primary Percutaneous Coronary Intervention (primary PCI) is an emergency procedure used to reopen the blocked artery, usually through balloon angioplasty and stent placement when indicated.",
      "The procedure aims to restore blood flow as quickly as possible and limit damage to the heart muscle. The speed of diagnosis and access to appropriate emergency treatment can make a critical difference.",
      "Dr. B. Vijaya Chaitanya's clinical expertise includes primary PCI for acute myocardial infarction.",
      "Recognise the warning signs. Act immediately. Chest pressure, breathlessness, cold sweating or discomfort spreading to the arm, jaw or back may indicate a heart attack. Seek emergency medical care immediately rather than waiting for symptoms to pass.",
    ],
  },
  {
    id: "peripheral-vascular",
    number: "05",
    title: "Peripheral Vascular Interventions",
    summary:
      "Catheter-based treatments for peripheral arterial disease, including renal and femoral angioplasty and selected aortic interventions.",
    seoTitle: "Peripheral Vascular Interventions in Vijayawada | Dr. B. Vijaya Chaitanya",
    metaDescription:
      "Discover catheter-based treatments for peripheral arterial disease, including renal and femoral angioplasty and selected aortic interventions.",
    articleTitle: "Peripheral Vascular Interventions: Treating Blood Vessels Beyond the Heart",
    paragraphs: [
      "Cardiovascular disease can affect arteries throughout the body, not just those supplying the heart. Narrowing or blockage in these vessels may compromise circulation to the kidneys, legs and other organs.",
      "Peripheral vascular interventions use catheter-based techniques, including balloon angioplasty and stenting when appropriate, to treat selected arterial blockages. The treatment depends on the location of the disease, its severity, the symptoms and the patient's overall health.",
      "Dr. B. Vijaya Chaitanya's documented professional profile includes extensive experience in peripheral vascular interventions.",
      "From renal artery disease to lower-limb arterial obstruction and selected aortic conditions, accurate imaging and careful procedural planning are essential to choosing an appropriate treatment strategy.",
      "The objective is to address the vascular problem while considering the patient's broader cardiovascular health and long-term needs.",
    ],
  },
  {
    id: "renal-angioplasty",
    number: "06",
    title: "Renal Angioplasty",
    summary:
      "Restoring blood flow to the kidneys in patients with narrowed renal arteries, with careful assessment of whether intervention may be beneficial.",
    seoTitle: "Renal Angioplasty in Vijayawada",
    metaDescription:
      "Learn about renal artery narrowing, renal angioplasty and how specialists assess whether intervention may benefit selected patients.",
    articleTitle: "Renal Angioplasty: Restoring Blood Flow to the Kidneys",
    paragraphs: [
      "The renal arteries supply blood to the kidneys. When one of these arteries becomes significantly narrowed, it can contribute to difficult-to-control high blood pressure or impaired kidney function in selected patients.",
      "Renal angioplasty is a catheter-based procedure that uses a balloon to widen a narrowed artery. A stent may be considered in appropriate cases.",
      "Treatment is not required for every renal artery narrowing. Specialist evaluation considers the severity of the blockage, blood pressure control, kidney function and whether intervention is likely to provide meaningful benefit.",
      "A careful assessment helps determine whether medical management, further investigation or a vascular intervention is appropriate.",
    ],
  },
  {
    id: "femoral-angioplasty",
    number: "07",
    title: "Femoral Angioplasty",
    summary:
      "Improving blood flow to the legs in patients with peripheral arterial disease, helping to relieve symptoms such as leg pain and reduced walking distance.",
    seoTitle: "Femoral Angioplasty in Vijayawada",
    metaDescription:
      "Understand femoral angioplasty for narrowed leg arteries, symptoms of peripheral arterial disease and treatment planning.",
    articleTitle: "Femoral Angioplasty: Improving Blood Flow to the Legs",
    paragraphs: [
      "The femoral arteries carry blood to the lower limbs. When these arteries become narrowed by peripheral arterial disease, patients may experience leg pain while walking, reduced walking distance or, in advanced cases, pain at rest and non-healing wounds.",
      "Femoral angioplasty uses a catheter and balloon to widen a narrowed artery. Stenting or other endovascular techniques may be considered depending on the location and extent of the disease.",
      "Treatment decisions depend on symptoms, imaging findings, limb health and the response to medical therapy and lifestyle measures.",
      "The goal is to improve circulation where appropriate and support better mobility and limb health.",
    ],
  },
  {
    id: "aortic-interventions",
    number: "08",
    title: "Aortic Interventions",
    summary:
      "Specialised endovascular treatment for conditions affecting the aorta, including aneurysms and other aortic diseases, with individualised treatment planning.",
    seoTitle: "Aortic Interventions in Vijayawada",
    metaDescription:
      "Explore endovascular aortic interventions, including assessment and treatment options for selected aortic conditions.",
    articleTitle: "Aortic Interventions: Specialised Treatment for the Body's Largest Artery",
    paragraphs: [
      "The aorta carries blood from the heart to the rest of the body. Conditions affecting this major artery, including selected aneurysms and other aortic diseases, can require highly specialised assessment and treatment.",
      "Depending on the condition, endovascular aortic interventions may involve delivering a stent graft through blood vessels to treat a diseased section of the aorta. The appropriate treatment depends on the anatomy, location, urgency and overall clinical condition.",
      "Not all aortic conditions are suitable for catheter-based treatment. Some require open surgery or careful medical management.",
      "A multidisciplinary specialist team determines the safest and most appropriate approach for each patient.",
    ],
  },
  {
    id: "asd-vsd-closure",
    number: "09",
    title: "ASD and VSD Device Closure",
    summary:
      "Catheter-based closure of selected atrial or ventricular septal defects, with detailed assessment to determine suitability and the most appropriate management plan.",
    seoTitle: "ASD and VSD Device Closure | Structural Heart Care in Vijayawada",
    metaDescription:
      "Understand catheter-based ASD and VSD device closure, how septal defects affect the heart and how suitability for treatment is assessed.",
    articleTitle: "ASD and VSD Device Closure: Treating Selected Defects Within the Heart",
    paragraphs: [
      "Atrial Septal Defect (ASD) and Ventricular Septal Defect (VSD) are openings in the walls separating the heart's chambers. Depending on their size and location, these defects can alter blood flow and place additional strain on the heart and lungs.",
      "In selected patients, device closure can treat an appropriate defect through a catheter-based procedure, avoiding the need for conventional open-heart surgery. The device is positioned to close the opening after detailed evaluation of the defect's anatomy and suitability.",
      "Not every ASD or VSD can be closed using a device. Some require surgery, while others may be monitored without intervention.",
      "Echocardiography, anatomical assessment and specialist evaluation help determine the appropriate management plan, particularly when treating children or patients with complex congenital heart disease.",
    ],
  },
  {
    id: "pacemaker-implantation",
    number: "10",
    title: "Pacemaker Implantation",
    summary:
      "Implantation of a pacemaker to support the heart's natural rhythm in patients with slow heart rhythms or conduction problems.",
    seoTitle: "Pacemaker Implantation in Vijayawada | Dr. B. Vijaya Chaitanya",
    metaDescription:
      "Learn about pacemaker implantation for slow heart rhythms, common symptoms, device function and specialist assessment in Vijayawada.",
    articleTitle: "Pacemaker Implantation: Supporting the Heart's Natural Rhythm",
    paragraphs: [
      "The heart relies on electrical signals to maintain a regular rhythm. When these signals are disrupted, the heartbeat may become abnormally slow, potentially causing dizziness, fatigue, fainting or reduced exercise tolerance.",
      "A pacemaker is a small electronic device that helps regulate the heartbeat when the heart's natural electrical system cannot maintain an adequate rhythm. Implantation involves placing the device and connecting leads, when required, to deliver electrical impulses to the heart.",
      "Pacemakers are recommended for specific rhythm disorders following clinical assessment and appropriate investigations. Not every slow heartbeat requires a device.",
      "Dr. B. Vijaya Chaitanya's professional profile documents experience in pacemaker implantation.",
      "The treatment plan considers the underlying rhythm problem, symptoms, associated conditions and the type of pacing system most appropriate for the patient.",
    ],
  },
  {
    id: "icd-implantation",
    number: "11",
    title: "Implantable Cardioverter-Defibrillator (ICD)",
    summary:
      "Advanced treatment for selected patients at risk of life-threatening heart rhythms, helping to detect and correct dangerous arrhythmias.",
    seoTitle: "ICD Implantation in Vijayawada | Cardiac Rhythm Specialist",
    metaDescription:
      "Understand implantable cardioverter-defibrillators, their role in preventing sudden cardiac death in selected patients and how ICD suitability is assessed.",
    articleTitle: "ICD Implantation: Protection Against Dangerous Heart Rhythms",
    paragraphs: [
      "Some abnormal heart rhythms can become life-threatening within minutes. An Implantable Cardioverter-Defibrillator (ICD) continuously monitors the heart's rhythm and can deliver therapy when it detects certain dangerous ventricular arrhythmias.",
      "ICDs are recommended for selected patients at significant risk of these rhythms, including some people with previous life-threatening arrhythmias or particular forms of structural heart disease and heart failure.",
      "An ICD is different from a conventional pacemaker, although some devices provide both pacing and defibrillation functions.",
      "Decisions about ICD implantation require careful assessment of the patient's heart condition, rhythm history, overall prognosis and expected benefit.",
      "Dr. B. Vijaya Chaitanya's professional profile lists ICD and CRT device implantation among his areas of technical experience.",
    ],
  },
  {
    id: "rotablation-atherectomy",
    number: "12",
    title: "Rotablation and Atherectomy",
    summary:
      "Specialised techniques to treat heavily calcified coronary artery blockages, using a rotating device or atherectomy to modify or remove calcified plaque.",
    seoTitle: "Rotablation and Atherectomy in Coronary Angioplasty | Vijayawada",
    metaDescription:
      "Learn how rotablation and atherectomy can help treat selected heavily calcified arterial blockages during complex coronary intervention.",
    articleTitle: "Rotablation and Atherectomy: Managing Complex, Calcified Artery Blockages",
    paragraphs: [
      "Some coronary artery blockages become heavily calcified, making them particularly challenging to treat with conventional balloon angioplasty and stenting alone.",
      "Rotablation uses a specialised rotating device to modify selected areas of calcified plaque, helping prepare the artery for subsequent treatment. Atherectomy is a broader term for techniques that modify or remove plaque in selected blood vessels, with the method depending on the anatomy and clinical indication.",
      "These procedures are reserved for carefully selected cases and require specialised equipment, technical expertise and procedural planning.",
      "The choice of technique depends on the location and severity of calcification, vessel anatomy, imaging findings and the patient's clinical condition.",
      "In complex coronary intervention, the objective is to prepare the lesion appropriately and support safe, effective treatment where the technique is indicated.",
    ],
  },
  {
    id: "ivus-oct-guided",
    number: "13",
    title: "IVUS and OCT Guided Interventions",
    summary:
      "Intravascular imaging technologies to provide detailed views of coronary arteries, helping to guide precise and effective treatment.",
    seoTitle: "IVUS and OCT Guided Angioplasty in Vijayawada | Dr. Vijaya Chaitanya",
    metaDescription:
      "Discover how intravascular ultrasound (IVUS) and optical coherence tomography (OCT) help cardiologists assess coronary arteries and guide selected angioplasty procedures.",
    articleTitle: "IVUS and OCT: Seeing Beyond the Angiogram",
    paragraphs: [
      "A conventional coronary angiogram shows the outline of blood flowing through the coronary arteries. In selected complex cases, additional imaging can provide a more detailed understanding of the artery wall, plaque and stent placement.",
      "Intravascular Ultrasound (IVUS) uses ultrasound from within the artery to assess vessel dimensions and plaque characteristics. Optical Coherence Tomography (OCT) uses light-based imaging to produce highly detailed views of the artery's internal structures.",
      "These technologies can help clinicians plan complex interventions, assess stent expansion and identify findings that may not be fully apparent on angiography alone.",
      "IVUS and OCT are not necessary for every angioplasty. Their use depends on the clinical situation, lesion characteristics and the information needed to guide treatment.",
      "Dr. B. Vijaya Chaitanya's professional profile specifically lists IVUS/OCT-guided procedures among his technical skills.",
    ],
  },
  {
    id: "cardiac-transplant",
    number: "14",
    title: "Cardiac Transplant Cardiology",
    summary:
      "Comprehensive care for patients undergoing heart transplantation, including evaluation, pre-transplant planning, post-transplant management and long-term follow-up.",
    seoTitle: "Heart Transplant Cardiology | Specialist Cardiac Care",
    metaDescription:
      "Learn about heart transplant evaluation, specialist cardiac management and long-term follow-up for patients undergoing heart transplantation.",
    articleTitle: "Cardiac Transplant Cardiology: Care Across Every Stage of the Journey",
    paragraphs: [
      "Heart transplantation is a specialised treatment for selected patients with advanced heart disease when other appropriate therapies can no longer provide sufficient benefit.",
      "Cardiac transplant cardiology involves evaluating patients for transplantation, coordinating pre-transplant investigations, supporting post-transplant recovery and monitoring long-term heart function. Follow-up care may include surveillance for rejection, management of immunosuppressive medication, monitoring for infection and assessment of cardiovascular risk.",
      "Transplant care requires a multidisciplinary team that may include transplant cardiologists, cardiac surgeons, specialist nurses and other clinical professionals.",
      "Patients with advanced heart failure need an individual assessment to understand the available treatment options, which may include optimised medical therapy, selected devices, mechanical circulatory support or transplantation.",
      "Specialist evaluation helps determine the most appropriate pathway for each patient.",
    ],
  },
];
