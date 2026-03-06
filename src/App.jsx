import { useState, useRef, useEffect } from "react";

// ─── DATA ────────────────────────────────────────────────────────────────────

const REGIONS = [
  { id: "all", name: "All of British Columbia", health: "Province-wide" },
  { id: "metro-vancouver", name: "Metro Vancouver", health: "Vancouver Coastal Health / Fraser Health" },
  { id: "capital", name: "Capital Regional District (Victoria)", health: "Island Health" },
  { id: "fraser-valley", name: "Fraser Valley", health: "Fraser Health" },
  { id: "central-okanagan", name: "Central Okanagan (Kelowna)", health: "Interior Health" },
  { id: "north-okanagan", name: "North Okanagan (Vernon)", health: "Interior Health" },
  { id: "okanagan-similkameen", name: "Okanagan-Similkameen (Penticton)", health: "Interior Health" },
  { id: "thompson-nicola", name: "Thompson-Nicola (Kamloops)", health: "Interior Health" },
  { id: "nanaimo", name: "Nanaimo Regional District", health: "Island Health" },
  { id: "cowichan-valley", name: "Cowichan Valley", health: "Island Health" },
  { id: "comox-valley", name: "Comox Valley", health: "Island Health" },
  { id: "alberni-clayoquot", name: "Alberni-Clayoquot", health: "Island Health" },
  { id: "strathcona", name: "Strathcona (Campbell River)", health: "Island Health" },
  { id: "cariboo", name: "Cariboo (Williams Lake)", health: "Interior Health" },
  { id: "fraser-fort-george", name: "Fraser-Fort George (Prince George)", health: "Northern Health" },
  { id: "bulkley-nechako", name: "Bulkley-Nechako", health: "Northern Health" },
  { id: "kitimat-stikine", name: "Kitimat-Stikine (Terrace)", health: "Northern Health" },
  { id: "peace-river", name: "Peace River (Fort St. John)", health: "Northern Health" },
  { id: "columbia-shuswap", name: "Columbia-Shuswap (Revelstoke/Salmon Arm)", health: "Interior Health" },
  { id: "kootenay-boundary", name: "Kootenay Boundary (Trail)", health: "Interior Health" },
  { id: "central-kootenay", name: "Central Kootenay (Nelson)", health: "Interior Health" },
  { id: "east-kootenay", name: "East Kootenay (Cranbrook)", health: "Interior Health" },
  { id: "squamish-lillooet", name: "Squamish-Lillooet", health: "Vancouver Coastal Health" },
  { id: "sunshine-coast", name: "Sunshine Coast", health: "Vancouver Coastal Health" },
  { id: "powell-river", name: "Powell River (qathet)", health: "Vancouver Coastal Health" },
  { id: "mount-waddington", name: "Mount Waddington (Port Hardy)", health: "Island Health" },
  { id: "central-coast", name: "Central Coast (Bella Coola)", health: "Northern Health" },
  { id: "north-coast", name: "North Coast (Prince Rupert)", health: "Northern Health" },
  { id: "northern-rockies", name: "Northern Rockies (Fort Nelson)", health: "Northern Health" },
  { id: "stikine", name: "Stikine Region", health: "Northern Health" },
];

const CATEGORIES = [
  { id: "crisis", name: "Crisis & Emergency", icon: "🆘", color: "#D94F4F", desc: "Immediate help when you need it most" },
  { id: "government", name: "Government Services", icon: "🏛️", color: "#2E86AB", desc: "Publicly funded programs & health authorities" },
  { id: "nonprofit", name: "Non-Profit Organizations", icon: "💚", color: "#3A9E6E", desc: "CMHA branches & community organizations" },
  { id: "medical", name: "Medical & Clinical", icon: "🏥", color: "#7E57C2", desc: "Treatment programs & clinical care" },
  { id: "support", name: "Support Groups", icon: "🤝", color: "#E67E22", desc: "Peer support & family resources" },
  { id: "indigenous", name: "Indigenous Services", icon: "🪶", color: "#C48B5C", desc: "Culturally safe support for Indigenous peoples" },
  { id: "youth", name: "Youth & Family", icon: "🌱", color: "#1BA87E", desc: "Services for ages 12–24 and caregivers" },
  { id: "virtual", name: "Virtual & Online", icon: "💻", color: "#3498DB", desc: "Apps, online tools & telehealth" },
  { id: "substance", name: "Substance Use", icon: "🔄", color: "#8E44AD", desc: "Addiction recovery & harm reduction" },
  { id: "workplace", name: "Workplace & Financial", icon: "💼", color: "#546E7A", desc: "Workplace wellness & financial navigation" },
];

const RESOURCES = [
  { id: 1, category: "crisis", name: "1-800-SUICIDE (BC Crisis Line)", description: "Confidential crisis line for people feeling suicidal or worried about someone. Available 24/7 in up to 140 languages.", phone: "1-800-784-2433", website: "https://crisiscentre.bc.ca", regions: ["all"], hours: "24/7", free: true },
  { id: 2, category: "crisis", name: "310 Mental Health Support Line", description: "Emotional support, information, and resources for mental health. No area code needed — just dial 310-6789 from anywhere in BC.", phone: "310-6789", website: "https://www.crisislines.bc.ca", regions: ["all"], hours: "24/7", free: true },
  { id: 3, category: "crisis", name: "988 Suicide Crisis Helpline", description: "Canada's national three-digit number for suicide prevention and emotional distress support. Call or text 988.", phone: "988", website: "https://988.ca", regions: ["all"], hours: "24/7", free: true },
  { id: 4, category: "crisis", name: "KUU-US Crisis Response Service", description: "Culturally safe crisis support for Indigenous peoples in BC. Provides immediate emotional support with cultural understanding.", phone: "1-800-588-8717", website: "https://www.kuu-uscrisisline.com", regions: ["all"], hours: "24/7", free: true },
  { id: 5, category: "crisis", name: "Crisis Centre of BC", description: "Provides crisis intervention, suicide prevention, and emotional support. Also offers wellness workshops for communities.", phone: "604-872-3311", website: "https://crisiscentre.bc.ca", regions: ["metro-vancouver", "all"], hours: "24/7", free: true },
  { id: 51, category: "crisis", name: "Vancouver Island Crisis Society", description: "Crisis support and intervention services for residents across Vancouver Island and the Gulf Islands.", phone: "1-888-494-3888", website: "https://vicrisis.ca", regions: ["capital", "nanaimo", "cowichan-valley", "comox-valley", "alberni-clayoquot", "strathcona", "mount-waddington"], hours: "24/7", free: true },
  { id: 6, category: "government", name: "HealthLink BC (8-1-1)", description: "Speak to a nurse, pharmacist, or dietitian about health concerns including mental health. Available in 130+ languages.", phone: "8-1-1", website: "https://www.healthlinkbc.ca", regions: ["all"], hours: "24/7", free: true },
  { id: 7, category: "government", name: "Help Starts Here (BC Government)", description: "Provincial portal with over 2,500 mental health and substance use service listings searchable by location across BC.", website: "https://www.helpstartshere.gov.bc.ca", regions: ["all"], free: true },
  { id: 8, category: "government", name: "BC Mental Health & Substance Use Services", description: "Provincial Health Services Authority program for people with the most severe and complex mental health and substance use disorders.", phone: "604-524-7000", website: "https://www.bcmhsus.ca", regions: ["all"], free: true },
  { id: 9, category: "government", name: "Vancouver Coastal Health — Mental Health", description: "Regional health authority providing community mental health centres, psychiatric services, and outpatient programs.", phone: "604-675-3894", website: "http://www.vch.ca/your-care/mental-health-substance-use", regions: ["metro-vancouver", "squamish-lillooet", "sunshine-coast", "powell-river", "central-coast"], free: true },
  { id: 10, category: "government", name: "Fraser Health — Mental Health & Substance Use", description: "Community mental health centres, psychiatry, early psychosis intervention, and substance use services across the Fraser region.", phone: "604-587-4600", website: "https://www.fraserhealth.ca/health-topics-a-to-z/mental-health-and-substance-use", regions: ["metro-vancouver", "fraser-valley"], free: true },
  { id: 11, category: "government", name: "Island Health — Mental Health & Substance Use", description: "Community mental health and addiction services across Vancouver Island and surrounding islands.", phone: "250-370-8300", website: "https://www.islandhealth.ca/our-services/mental-health-substance-use-services", regions: ["capital", "nanaimo", "cowichan-valley", "comox-valley", "alberni-clayoquot", "strathcona", "mount-waddington"], free: true },
  { id: 12, category: "government", name: "Interior Health — Mental Health & Substance Use", description: "Regional mental health centres, outreach teams, and substance use services throughout BC's Interior.", phone: "250-862-4200", website: "https://www.interiorhealth.ca/FindUs/MentalHealthSubstanceUse", regions: ["central-okanagan", "north-okanagan", "okanagan-similkameen", "thompson-nicola", "cariboo", "columbia-shuswap", "kootenay-boundary", "central-kootenay", "east-kootenay"], free: true },
  { id: 13, category: "government", name: "Northern Health — Mental Health & Addictions", description: "Mental health clinics, psychiatry, and addiction services for northern BC communities. Includes outreach and telehealth.", phone: "250-565-2649", website: "https://www.northernhealth.ca/services/mental-health-addictions", regions: ["fraser-fort-george", "bulkley-nechako", "kitimat-stikine", "peace-river", "northern-rockies", "stikine", "north-coast", "central-coast"], free: true },
  { id: 14, category: "government", name: "Foundry BC", description: "One-stop centres for youth aged 12–24 offering mental health care, substance use services, peer support, and primary care.", phone: "Various by location", website: "https://foundrybc.ca", regions: ["all"], free: true },
  { id: 15, category: "nonprofit", name: "Canadian Mental Health Association — BC Division", description: "Programs and services across BC including advocacy, peer support, housing support, and community education.", phone: "1-800-555-8222", website: "https://bc.cmha.ca", regions: ["all"], free: true },
  { id: 16, category: "nonprofit", name: "CMHA Vancouver-Fraser", description: "Peer support, employment services, housing support, and community integration in the Vancouver-Fraser region.", phone: "604-872-4902", website: "https://vancouver-fraser.cmha.bc.ca", regions: ["metro-vancouver"], free: true },
  { id: 17, category: "nonprofit", name: "CMHA Kelowna", description: "Mental health support, Bounce Back program, and community outreach in the Central Okanagan.", phone: "250-861-3644", website: "https://kelowna.cmha.bc.ca", regions: ["central-okanagan"], free: true },
  { id: 18, category: "nonprofit", name: "CMHA Kamloops", description: "Peer support, advocacy, Bounce Back program, and mental health services for the Thompson-Nicola region.", phone: "250-374-0440", website: "https://kamloops.cmha.bc.ca", regions: ["thompson-nicola"], free: true },
  { id: 19, category: "nonprofit", name: "CMHA Northern BC (Prince George)", description: "Mental health programs, housing support, and community outreach in northern BC.", phone: "250-564-8644", website: "https://northernbc.cmha.ca", regions: ["fraser-fort-george", "bulkley-nechako"], free: true },
  { id: 20, category: "nonprofit", name: "CMHA Vernon", description: "Community mental health services, peer support, and wellness programs for the North Okanagan.", phone: "250-542-3114", website: "https://vernon.cmha.bc.ca", regions: ["north-okanagan"], free: true },
  { id: 52, category: "nonprofit", name: "CMHA South Okanagan Similkameen", description: "Mental health services and peer support for the Penticton and South Okanagan area.", phone: "250-493-8999", website: "https://sos.cmha.bc.ca", regions: ["okanagan-similkameen"], free: true },
  { id: 53, category: "nonprofit", name: "CMHA Cowichan Valley", description: "Mental health programs and peer support for the Cowichan Valley region.", phone: "250-597-1372", website: "http://www.cmhacowichanvalley.com", regions: ["cowichan-valley"], free: true },
  { id: 54, category: "nonprofit", name: "CMHA Mid-Island (Nanaimo)", description: "Community mental health services for the mid-Vancouver Island region.", phone: "250-244-4042", regions: ["nanaimo"], free: true },
  { id: 55, category: "nonprofit", name: "CMHA Port Alberni", description: "Clubhouse, peer support, advocacy, food programs, housing, and outreach for the Alberni-Clayoquot region.", phone: "250-724-7199", website: "https://cmhaportalberni.ca", regions: ["alberni-clayoquot"], free: true },
  { id: 56, category: "nonprofit", name: "CMHA Shuswap-Revelstoke", description: "Mental health support and community programs for Salmon Arm and Revelstoke.", phone: "250-832-8477", regions: ["columbia-shuswap"], free: true },
  { id: 57, category: "nonprofit", name: "CMHA South Cariboo (100 Mile House)", description: "Mental health programs for the South Cariboo region.", phone: "250-395-4883", regions: ["cariboo"], free: true },
  { id: 58, category: "nonprofit", name: "CMHA Cariboo Chilcotin (Williams Lake)", description: "Community mental health services for Williams Lake and Cariboo Chilcotin.", phone: "250-398-8220", regions: ["cariboo"], free: true },
  { id: 21, category: "nonprofit", name: "Here to Help BC", description: "Quality information, self-tests, personal stories, and resources on mental health and substance use from seven BC partner agencies.", website: "https://www.heretohelp.bc.ca", regions: ["all"], free: true },
  { id: 22, category: "nonprofit", name: "BC Schizophrenia Society", description: "Education, support groups, and advocacy for people affected by schizophrenia and serious mental illnesses.", phone: "1-888-888-0029", website: "https://www.bcss.org", regions: ["all"], free: true },
  { id: 23, category: "nonprofit", name: "Mood Disorders Association of BC", description: "Support, education, and advocacy for people living with depression, bipolar disorder, and anxiety.", phone: "604-873-0103", website: "https://www.mdabc.net", regions: ["all"], free: true },
  { id: 24, category: "nonprofit", name: "Anxiety Canada (formerly AnxietyBC)", description: "Evidence-based resources, self-help tools, and the MindShift CBT app for managing anxiety.", website: "https://www.anxietycanada.com", regions: ["all"], free: true },
  { id: 25, category: "nonprofit", name: "BC Centre on Substance Use (BCCSU)", description: "Provincial resource for evidence-based guidance on substance use and treatment protocols.", website: "https://www.bccsu.ca", regions: ["all"], free: true },
  { id: 26, category: "medical", name: "Red Fish Healing Centre", description: "Provincial tertiary care facility providing specialized treatment for severe mental health and substance use conditions.", phone: "604-524-7000", website: "https://www.bcmhsus.ca", regions: ["metro-vancouver", "all"], free: true },
  { id: 27, category: "medical", name: "Bounce Back Program", description: "Free, guided self-help program for adults experiencing low mood, mild to moderate depression, anxiety, or stress. Delivered by phone with a trained coach.", phone: "1-866-639-0522", website: "https://bouncebackbc.ca", regions: ["all"], free: true },
  { id: 28, category: "medical", name: "BC Early Psychosis Intervention Program", description: "Specialized treatment for people experiencing psychosis for the first time.", website: "https://earlypsychosis.ca", regions: ["all"], free: true },
  { id: 29, category: "medical", name: "Community Mental Health Centres", description: "Publicly funded local clinics providing psychiatric assessment, treatment, case management, and group therapy.", regions: ["all"], free: true },
  { id: 30, category: "medical", name: "Opioid Treatment Access Line", description: "Connect with a healthcare worker who can prescribe opioid treatment medication the same day you call.", phone: "1-833-804-8111", regions: ["all"], hours: "9 AM – 4 PM", free: true },
  { id: 31, category: "support", name: "FamilySmart", description: "Peer support, information, and navigation of mental health services for families of children and youth with mental health challenges.", phone: "1-855-887-8004", website: "https://familysmart.ca", regions: ["all"], free: true },
  { id: 32, category: "support", name: "Kelty Mental Health Resource Centre", description: "Free mental health and substance use information and peer support for parents, caregivers, and families of children and youth.", phone: "1-800-665-1822", website: "https://keltymentalhealth.ca", regions: ["all"], free: true },
  { id: 33, category: "support", name: "BC Bereavement Helpline", description: "Support for those grieving. Provides referrals to bereavement support groups and counselling.", phone: "1-877-779-2223", website: "https://bcbh.ca", regions: ["all"], free: true },
  { id: 59, category: "support", name: "Pacific Centre Family Services", description: "Affordable community counselling for the Greater Victoria area, primarily the West Shore and Sooke.", phone: "250-478-8357", website: "https://www.pacificcentrefamilyservices.org", regions: ["capital"], free: false },
  { id: 35, category: "indigenous", name: "First Nations Health Authority — Mental Wellness", description: "Mental wellness programs, counselling, and cultural support for First Nations people in BC.", phone: "1-866-913-0033", website: "https://www.fnha.ca/what-we-do/mental-wellness-and-substance-use", regions: ["all"], free: true },
  { id: 36, category: "indigenous", name: "Indian Residential School Survivors Society Crisis Line", description: "Crisis support for residential school survivors and their families. Culturally safe, trauma-informed.", phone: "1-800-721-0066", website: "https://www.irsss.ca", regions: ["all"], hours: "24/7", free: true },
  { id: 37, category: "indigenous", name: "National Indian Residential Schools Crisis Line", description: "Emotional crisis referral services and health support for Residential School survivors.", phone: "1-866-925-4419", regions: ["all"], hours: "24/7", free: true },
  { id: 38, category: "indigenous", name: "Métis Nation BC — Health & Wellness", description: "Métis-led mental health initiatives, counselling, and support for Métis people.", website: "https://www.mnbc.ca", regions: ["all"], free: true },
  { id: 39, category: "indigenous", name: "Native Courtworker and Counselling Association of BC", description: "Culturally appropriate counselling for Indigenous people navigating the justice system.", phone: "604-985-5355", website: "https://nccabc.ca", regions: ["all"], free: true },
  { id: 40, category: "youth", name: "Foundry Virtual", description: "Free virtual mental health and substance use services for youth ages 12–24. Drop-in counselling, peer support, and groups.", website: "https://foundrybc.ca/virtual", regions: ["all"], free: true },
  { id: 41, category: "youth", name: "Child & Youth Mental Health (CYMH)", description: "Ministry of Children and Family Development intake and counselling for children, youth, and families. Virtual care available.", website: "https://www2.gov.bc.ca/gov/content/health/managing-your-health/mental-health-substance-use/child-teen-mental-health", regions: ["all"], free: true },
  { id: 42, category: "youth", name: "Y Mind (YMCA BC)", description: "Free online programs for young people aged 13–30 to cope with stress, worry, and anxiety.", website: "https://www.gv.ymca.ca/ymind", regions: ["all"], free: true },
  { id: 43, category: "youth", name: "Kids Help Phone", description: "Canada-wide 24/7 counselling and support for young people. Text, call, or live chat.", phone: "1-800-668-6868", website: "https://kidshelpphone.ca", regions: ["all"], hours: "24/7", free: true },
  { id: 44, category: "youth", name: "Jessie's Legacy — Eating Disorder Prevention", description: "Online eating disorder prevention education, resources, and support for youth, families, and educators.", website: "https://jessieslegacy.com", regions: ["all"], free: true },
  { id: 45, category: "virtual", name: "BounceBack Online", description: "Free online CBT-based self-help program for managing depression, anxiety, worry, and stress.", phone: "1-866-639-0522", website: "https://bouncebackbc.ca", regions: ["all"], free: true },
  { id: 46, category: "virtual", name: "Wellness Together Canada", description: "Government of Canada portal with free mental health supports including self-assessment, peer support, and phone counselling.", website: "https://www.wellnesstogether.ca", regions: ["all"], free: true },
  { id: 47, category: "virtual", name: "MindShift CBT App", description: "Free app using Cognitive Behavioural Therapy strategies to help manage anxiety.", website: "https://www.anxietycanada.com/resources/mindshift-cbt", regions: ["all"], free: true },
  { id: 48, category: "virtual", name: "MindFit Toolkit: Mental Wellness for Men", description: "Mental health tools and strategies specifically designed for men and their families.", website: "https://mentalwellnessformen.ca", regions: ["all"], free: true },
  { id: 61, category: "virtual", name: "Dealing with Psychosis Toolkit", description: "Online resource helping individuals and families understand psychosis and find age-appropriate treatments.", website: "https://earlypsychosis.ca", regions: ["all"], free: true },
  { id: 49, category: "substance", name: "Alcohol & Drug Information Referral Service", description: "Province-wide information and referral to substance use treatment programs and support groups.", phone: "1-800-663-1441", regions: ["all"], hours: "24/7", free: true },
  { id: 50, category: "substance", name: "Gambling Support BC", description: "Free support for anyone struggling with their own or a loved one's gambling.", phone: "1-888-795-6111", website: "https://www.gamblingsupportbc.ca", regions: ["all"], hours: "24/7", free: true },
  { id: 63, category: "workplace", name: "Care for Caregivers", description: "Free resources, tools, and tips to support healthcare and community service workers' mental health.", website: "https://www.careforcaregivers.ca", regions: ["all"], free: true },
  { id: 64, category: "workplace", name: "Care to Speak", description: "Free, confidential peer support for healthcare workers. Available by text, phone, or online chat.", website: "https://www.careforcaregivers.ca", regions: ["all"], free: true },
  { id: 65, category: "workplace", name: "People Working Well", description: "BC workplace mental health webinars, free training, and learning coaches.", website: "https://www.workingwell.gov.bc.ca", regions: ["all"], free: true },
  { id: 66, category: "workplace", name: "BC 211", description: "Free, confidential, multilingual service connecting people to community, government, and social services across BC.", phone: "2-1-1", website: "https://bc211.ca", regions: ["all"], hours: "24/7", free: true },
];

// Events are fetched live via Claude API with web search — no hardcoded events

// ─── STYLES ──────────────────────────────────────────────────────────────────

const fonts = { heading: "'DM Serif Display', Georgia, serif", body: "'DM Sans', system-ui, sans-serif" };

// ─── COMPONENTS ──────────────────────────────────────────────────────────────

function ResourceCard({ resource, categoryColor, categoryIcon }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div onClick={() => setExpanded(!expanded)} style={{
      background: "#FFF", borderRadius: 16, padding: "18px 20px", marginBottom: 10, cursor: "pointer",
      borderLeft: `4px solid ${categoryColor}`,
      boxShadow: expanded ? "0 6px 24px rgba(0,0,0,0.06)" : "0 1px 4px rgba(0,0,0,0.03)",
      transition: "all 0.25s ease",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
            <span style={{ fontSize: 17, flexShrink: 0 }}>{categoryIcon}</span>
            <h3 style={{ fontFamily: fonts.heading, fontSize: 15.5, fontWeight: 400, color: "#1E293B", margin: 0, lineHeight: 1.3 }}>{resource.name}</h3>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
            {resource.free && <span style={{ background: "#ECFDF5", color: "#059669", fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20, fontFamily: fonts.body }}>FREE</span>}
            {resource.hours === "24/7" && <span style={{ background: "#FFF7ED", color: "#D97706", fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20, fontFamily: fonts.body }}>24/7</span>}
          </div>
        </div>
        <span style={{ fontSize: 15, color: "#CBD5E1", transition: "transform 0.25s", transform: expanded ? "rotate(180deg)" : "rotate(0)", flexShrink: 0, marginLeft: 8, marginTop: 4 }}>▾</span>
      </div>
      {expanded && (
        <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid #F1F5F9", animation: "fadeIn 0.2s ease" }}>
          <p style={{ fontFamily: fonts.body, fontSize: 13.5, color: "#475569", lineHeight: 1.65, margin: "0 0 14px 0" }}>{resource.description}</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {resource.phone && <a href={`tel:${resource.phone.replace(/[^0-9+]/g, '')}`} onClick={e => e.stopPropagation()} style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#EFF6FF", color: "#2563EB", padding: "9px 16px", borderRadius: 10, fontSize: 13, fontWeight: 600, fontFamily: fonts.body, textDecoration: "none" }}>📞 {resource.phone}</a>}
            {resource.website && <a href={resource.website} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#F5F3FF", color: "#7C3AED", padding: "9px 16px", borderRadius: 10, fontSize: 13, fontWeight: 600, fontFamily: fonts.body, textDecoration: "none" }}>🔗 Website</a>}
          </div>
          {resource.hours && resource.hours !== "24/7" && <p style={{ fontFamily: fonts.body, fontSize: 11.5, color: "#94A3B8", marginTop: 10, marginBottom: 0 }}>Hours: {resource.hours}</p>}
        </div>
      )}
    </div>
  );
}

function EventCard({ event }) {
  const [expanded, setExpanded] = useState(false);
  const d = new Date(event.date + "T00:00:00");
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  const typeColors = { workshop: "#2E86AB", training: "#7E57C2", "drop-in": "#3A9E6E", program: "#E67E22", conference: "#D94F4F", info: "#3498DB" };
  const tc = typeColors[event.type] || "#546E7A";

  return (
    <div onClick={() => setExpanded(!expanded)} style={{
      background: "#FFF", borderRadius: 16, overflow: "hidden", marginBottom: 10,
      boxShadow: expanded ? "0 6px 24px rgba(0,0,0,0.06)" : "0 1px 4px rgba(0,0,0,0.03)",
      cursor: "pointer", transition: "all 0.25s ease",
    }}>
      <div style={{ display: "flex" }}>
        <div style={{ background: `linear-gradient(135deg, ${tc}, ${tc}DD)`, minWidth: 68, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "14px 6px", color: "#FFF", flexShrink: 0 }}>
          <span style={{ fontSize: 10.5, fontWeight: 600, fontFamily: fonts.body, textTransform: "uppercase", opacity: 0.85 }}>{months[d.getMonth()]}</span>
          <span style={{ fontSize: 24, fontWeight: 700, fontFamily: fonts.body, lineHeight: 1.1 }}>{d.getDate()}</span>
          <span style={{ fontSize: 10, fontFamily: fonts.body, opacity: 0.7 }}>{days[d.getDay()]}</span>
        </div>
        <div style={{ flex: 1, padding: "13px 15px", minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 6 }}>
            <div style={{ minWidth: 0 }}>
              <h3 style={{ fontFamily: fonts.heading, fontSize: 14.5, fontWeight: 400, color: "#1E293B", margin: "0 0 5px 0", lineHeight: 1.3 }}>{event.title}</h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 5, alignItems: "center" }}>
                <span style={{ fontFamily: fonts.body, fontSize: 11.5, color: "#64748B" }}>📍 {event.location}</span>
                {event.free && <span style={{ background: "#ECFDF5", color: "#059669", fontSize: 9.5, fontWeight: 700, padding: "1px 7px", borderRadius: 20, fontFamily: fonts.body }}>FREE</span>}
                {event.recurring && <span style={{ background: "#FFF7ED", color: "#C2410C", fontSize: 9.5, fontWeight: 600, padding: "1px 7px", borderRadius: 20, fontFamily: fonts.body }}>{event.recurring}</span>}
              </div>
            </div>
            <span style={{ fontSize: 13, color: "#CBD5E1", transition: "transform 0.25s", transform: expanded ? "rotate(180deg)" : "rotate(0)", flexShrink: 0, marginTop: 2 }}>▾</span>
          </div>
          {expanded && (
            <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid #F1F5F9", animation: "fadeIn 0.2s ease" }}>
              <p style={{ fontFamily: fonts.body, fontSize: 13, color: "#475569", lineHeight: 1.6, margin: "0 0 8px 0" }}>{event.description}</p>
              <p style={{ fontFamily: fonts.body, fontSize: 11.5, color: "#94A3B8", margin: "0 0 3px 0" }}>Organized by: {event.organizer}</p>
              {event.endDate && <p style={{ fontFamily: fonts.body, fontSize: 11.5, color: "#94A3B8", margin: "0 0 10px 0" }}>Runs: {event.date} to {event.endDate}</p>}
              {event.link && <a href={event.link} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} style={{ display: "inline-flex", alignItems: "center", gap: 5, background: tc, color: "#FFF", padding: "8px 16px", borderRadius: 10, fontSize: 12.5, fontWeight: 600, fontFamily: fonts.body, textDecoration: "none" }}>Learn more & register →</a>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── MAIN APP ────────────────────────────────────────────────────────────────

// ─── AI EVENT FETCHER ─────────────────────────────────────────────────────────

const EVENTS_CACHE_KEY = "__bc_mh_events_cache";
const CACHE_TTL_MS = 4 * 60 * 60 * 1000; // 4 hours

function getSessionCache() {
  try {
    const raw = window.__bcMhEventsCache;
    if (raw && raw.ts && (Date.now() - raw.ts < CACHE_TTL_MS)) return raw.events;
  } catch {}
  return null;
}

function setSessionCache(events) {
  try { window.__bcMhEventsCache = { ts: Date.now(), events }; } catch {}
}

async function fetchEventsFromAI() {
  const cached = getSessionCache();
  if (cached) return cached;

  const today = new Date();
  const twoMonthsLater = new Date(today);
  twoMonthsLater.setMonth(twoMonthsLater.getMonth() + 2);
  const todayStr = today.toISOString().slice(0, 10);
  const endStr = twoMonthsLater.toISOString().slice(0, 10);

  const prompt = `You are a helpful assistant that finds upcoming mental health events in British Columbia, Canada.

Today's date is ${todayStr}. Search the web for mental health events, workshops, support groups, training sessions, and conferences happening in British Columbia between ${todayStr} and ${endStr}.

Search for events from these key sources:
- CMHA BC and its branches (cmha.bc.ca, victoria.cmha.bc.ca, kamloops.cmha.bc.ca, etc.)
- Foundry BC (foundrybc.ca) — youth workshops and groups
- BC Association of Clinical Counsellors (bcacc.ca)
- Canadian Mental Health conferences in BC
- BC Schizophrenia Society events
- Anxiety Canada events
- Any other BC mental health workshops, webinars, or support groups

Return ONLY a JSON array (no markdown, no backticks, no preamble) of event objects with these fields:
- "title": string (event name)
- "date": string (YYYY-MM-DD of start date)
- "endDate": string or null (YYYY-MM-DD if multi-day)
- "recurring": string or null (e.g. "Every Wednesday", "Weekly")
- "location": string (city or "Online")
- "organizer": string
- "description": string (1-2 sentences)
- "link": string or null (URL to event page)
- "free": boolean
- "type": one of "workshop", "training", "drop-in", "program", "conference", "info", "support-group"

Find as many real, upcoming events as you can (aim for 10-20). Only include events with real dates that haven't passed yet. Sort by date ascending.`;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 4000,
        tools: [{ type: "web_search_20250305", name: "web_search" }],
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await response.json();

    // Extract text content from all response blocks
    const textParts = (data.content || [])
      .filter(b => b.type === "text")
      .map(b => b.text)
      .join("\n");

    // Try to parse JSON from the response
    let events = [];
    const jsonMatch = textParts.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      const cleaned = jsonMatch[0].replace(/```json|```/g, "").trim();
      events = JSON.parse(cleaned);
    }

    // Validate and clean events
    events = events
      .filter(e => e.title && e.date && e.location)
      .map((e, i) => ({
        id: i + 1,
        title: e.title || "Untitled Event",
        date: e.date,
        endDate: e.endDate || null,
        recurring: e.recurring || null,
        location: e.location || "BC",
        organizer: e.organizer || "Unknown",
        description: e.description || "",
        link: e.link || null,
        free: typeof e.free === "boolean" ? e.free : true,
        type: ["workshop","training","drop-in","program","conference","info","support-group"].includes(e.type) ? e.type : "workshop",
      }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    if (events.length > 0) {
      setSessionCache(events);
    }
    return events;
  } catch (err) {
    console.error("Failed to fetch events:", err);
    return [];
  }
}

// ─── MAIN APP ────────────────────────────────────────────────────────────────

export default function BCMentalHealthResources() {
  const [page, setPage] = useState("home");
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showRegionPicker, setShowRegionPicker] = useState(false);
  const [regionSearch, setRegionSearch] = useState("");
  const [aiEvents, setAiEvents] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(false);
  const [eventsError, setEventsError] = useState(false);
  const [eventsFetched, setEventsFetched] = useState(false);
  const topRef = useRef(null);

  useEffect(() => { if (topRef.current) topRef.current.scrollIntoView({ behavior: "smooth" }); }, [page, selectedCategory]);

  // Fetch events when user switches to events tab
  useEffect(() => {
    if (page === "events" && !eventsFetched) {
      setEventsLoading(true);
      setEventsError(false);
      fetchEventsFromAI()
        .then(events => {
          setAiEvents(events);
          setEventsFetched(true);
          if (events.length === 0) setEventsError(true);
        })
        .catch(() => { setEventsError(true); })
        .finally(() => { setEventsLoading(false); });
    }
  }, [page, eventsFetched]);

  const filteredResources = RESOURCES.filter(r => {
    const rm = selectedRegion === "all" || r.regions.includes("all") || r.regions.includes(selectedRegion);
    const cm = !selectedCategory || r.category === selectedCategory;
    const sm = !searchTerm || r.name.toLowerCase().includes(searchTerm.toLowerCase()) || r.description.toLowerCase().includes(searchTerm.toLowerCase());
    return rm && cm && sm;
  });

  const filteredEvents = aiEvents;
  const filteredRegions = REGIONS.filter(r => r.name.toLowerCase().includes(regionSearch.toLowerCase()));
  const currentRegion = REGIONS.find(r => r.id === selectedRegion);
  const currentCat = CATEGORIES.find(c => c.id === selectedCategory);

  return (
    <div ref={topRef} style={{ minHeight: "100vh", background: "linear-gradient(170deg, #FAFAF7 0%, #F3F1EC 40%, #EEF4F2 70%, #F6F3EE 100%)", fontFamily: fonts.body }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=DM+Serif+Display&display=swap');
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } }
        * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
        input::placeholder { color: #A0AEC0; }
        ::-webkit-scrollbar { width: 5px; } ::-webkit-scrollbar-track { background: transparent; } ::-webkit-scrollbar-thumb { background: #D1D5DB; border-radius: 10px; }
      `}</style>

      {/* HEADER */}
      <div style={{ background: "linear-gradient(135deg, #2E4057 0%, #3A5A70 45%, #4A7C6F 100%)", padding: "30px 20px 26px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -50, right: -50, width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,0.03)" }} />
        <div style={{ fontSize: 28, marginBottom: 6 }}>🌿</div>
        <h1 style={{ fontFamily: fonts.heading, fontSize: "clamp(21px, 5vw, 28px)", fontWeight: 400, color: "#FFF", margin: "0 0 5px 0", lineHeight: 1.2 }}>BC Mental Health Resources</h1>
        <p style={{ fontFamily: fonts.body, fontSize: 13.5, color: "rgba(255,255,255,0.7)", margin: 0, fontWeight: 300 }}>You're not alone. Find support in your community.</p>
      </div>

      {/* CRISIS BANNER */}
      <div style={{ background: "linear-gradient(90deg, #DC4545, #B91C1C)", padding: "11px 20px", textAlign: "center" }}>
        <p style={{ color: "#FFF", fontSize: 12.5, margin: 0, fontWeight: 500, lineHeight: 1.5 }}>
          🆘 <strong>In crisis?</strong>{" "}
          <a href="tel:988" style={{ color: "#FFF", fontWeight: 700, textDecoration: "underline" }}>Call/text 988</a>{" · "}
          <a href="tel:18007842433" style={{ color: "#FFF", fontWeight: 700, textDecoration: "underline" }}>1-800-784-2433</a>
          <span style={{ opacity: 0.8 }}> — 24/7, free</span>
        </p>
      </div>

      {/* MAIN */}
      <div style={{ maxWidth: 620, margin: "0 auto", padding: "18px 14px 100px" }}>

        {/* Region */}
        <div style={{ marginBottom: 14 }}>
          <button onClick={() => setShowRegionPicker(!showRegionPicker)} style={{
            width: "100%", background: "#FFF", border: "1.5px solid #E2E8F0", borderRadius: 13,
            padding: "12px 15px", fontSize: 13.5, fontFamily: fonts.body, color: "#334155", cursor: "pointer",
            textAlign: "left", display: "flex", justifyContent: "space-between", alignItems: "center",
          }}>
            <span>📍 {currentRegion?.name}</span>
            <span style={{ transform: showRegionPicker ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s", color: "#94A3B8" }}>▾</span>
          </button>
          {showRegionPicker && (
            <div style={{ background: "#FFF", borderRadius: 13, marginTop: 5, boxShadow: "0 10px 36px rgba(0,0,0,0.1)", overflow: "hidden", animation: "fadeIn 0.2s", maxHeight: 310, display: "flex", flexDirection: "column" }}>
              <div style={{ padding: "9px 12px 5px" }}>
                <input type="text" placeholder="Search regions..." value={regionSearch} onChange={e => setRegionSearch(e.target.value)} style={{ width: "100%", border: "1px solid #E2E8F0", borderRadius: 9, padding: "8px 11px", fontSize: 13, fontFamily: fonts.body, outline: "none" }} />
              </div>
              <div style={{ overflowY: "auto", maxHeight: 255 }}>
                {filteredRegions.map(r => (
                  <button key={r.id} onClick={() => { setSelectedRegion(r.id); setShowRegionPicker(false); setRegionSearch(""); }} style={{
                    width: "100%", background: selectedRegion === r.id ? "#EFF6FF" : "transparent",
                    border: "none", padding: "10px 14px", fontSize: 13, fontFamily: fonts.body,
                    color: "#334155", cursor: "pointer", textAlign: "left", borderBottom: "1px solid #F8FAFC",
                  }}>
                    <div style={{ fontWeight: selectedRegion === r.id ? 600 : 400 }}>{r.name}</div>
                    <div style={{ fontSize: 10.5, color: "#94A3B8", marginTop: 1 }}>{r.health}</div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* NAV TABS */}
        <div style={{ display: "flex", gap: 0, marginBottom: 20, background: "#FFF", borderRadius: 13, padding: 3.5, border: "1px solid #E2E8F0" }}>
          {[{ id: "home", label: "Home", icon: "🏠" }, { id: "events", label: "Events & Workshops", icon: "📅" }].map(tab => (
            <button key={tab.id} onClick={() => { setPage(tab.id); setSelectedCategory(null); setSearchTerm(""); }}
              style={{
                flex: 1, padding: "10px 6px", border: "none", borderRadius: 10, cursor: "pointer",
                fontFamily: fonts.body, fontSize: 13.5, fontWeight: (page === tab.id || (page === "category" && tab.id === "home")) ? 600 : 400,
                background: (page === tab.id || (page === "category" && tab.id === "home")) ? "#2E4057" : "transparent",
                color: (page === tab.id || (page === "category" && tab.id === "home")) ? "#FFF" : "#64748B",
                transition: "all 0.2s", display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
              }}>
              <span style={{ fontSize: 15 }}>{tab.icon}</span> {tab.label}
            </button>
          ))}
        </div>

        {/* ══════ HOME ══════ */}
        {page === "home" && (
          <div style={{ animation: "fadeIn 0.3s ease" }}>
            <p style={{ fontFamily: fonts.body, fontSize: 15, color: "#475569", lineHeight: 1.5, marginBottom: 20, textAlign: "center" }}>What kind of support are you looking for?</p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 24 }}>
              {CATEGORIES.map(cat => (
                <button key={cat.id} onClick={() => { setSelectedCategory(cat.id); setSearchTerm(""); setPage("category"); }}
                  style={{ background: "#FFF", border: "2px solid #EEF2F6", borderRadius: 16, padding: "16px 13px", cursor: "pointer", textAlign: "left", transition: "all 0.2s", position: "relative", overflow: "hidden" }}
                  onMouseOver={e => { e.currentTarget.style.borderColor = cat.color; e.currentTarget.style.boxShadow = `0 4px 18px ${cat.color}15`; }}
                  onMouseOut={e => { e.currentTarget.style.borderColor = "#EEF2F6"; e.currentTarget.style.boxShadow = "none"; }}
                >
                  <div style={{ fontSize: 26, marginBottom: 7 }}>{cat.icon}</div>
                  <div style={{ fontFamily: fonts.heading, fontSize: 14.5, color: "#1E293B", marginBottom: 3, lineHeight: 1.2 }}>{cat.name}</div>
                  <div style={{ fontFamily: fonts.body, fontSize: 11, color: "#94A3B8", lineHeight: 1.4 }}>{cat.desc}</div>
                  <div style={{ position: "absolute", top: 0, right: 0, width: 44, height: 44, background: `${cat.color}08`, borderRadius: "0 16px 0 44px" }} />
                </button>
              ))}
            </div>

            {/* Search */}
            <div style={{ marginBottom: 18 }}>
              <div style={{ background: "#FFF", borderRadius: 13, padding: 3.5, border: "1px solid #E2E8F0", display: "flex", alignItems: "center" }}>
                <span style={{ padding: "0 10px", fontSize: 16, color: "#CBD5E1" }}>🔍</span>
                <input type="text" placeholder="Search all resources..." value={searchTerm}
                  onChange={e => { setSearchTerm(e.target.value); if (e.target.value) { setSelectedCategory(null); setPage("category"); } }}
                  style={{ flex: 1, border: "none", outline: "none", padding: "10px 6px", fontSize: 13.5, fontFamily: fonts.body, background: "transparent", color: "#334155" }} />
                {searchTerm && <button onClick={() => { setSearchTerm(""); setPage("home"); setSelectedCategory(null); }} style={{ background: "none", border: "none", cursor: "pointer", padding: "0 10px", fontSize: 13, color: "#CBD5E1" }}>✕</button>}
              </div>
            </div>

            {/* Quick crisis */}
            <div style={{ background: "#FFF", borderRadius: 16, padding: "16px 18px", border: "1px solid #E2E8F0" }}>
              <h3 style={{ fontFamily: fonts.heading, fontSize: 15, color: "#1E293B", margin: "0 0 10px 0" }}>Quick-access crisis numbers</h3>
              {[
                { label: "988 Suicide Crisis Helpline", phone: "988", note: "Call or text" },
                { label: "BC Crisis Line", phone: "1-800-784-2433", note: "140+ languages" },
                { label: "Mental Health Support", phone: "310-6789", note: "No area code needed" },
                { label: "KUU-US Indigenous Crisis", phone: "1-800-588-8717", note: "Culturally safe" },
                { label: "Kids Help Phone", phone: "1-800-668-6868", note: "Youth 24/7" },
              ].map((l, i) => (
                <a key={i} href={`tel:${l.phone.replace(/[^0-9]/g, '')}`} style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "9px 12px", background: i % 2 === 0 ? "#FAFAFA" : "#FFF", borderRadius: 9, textDecoration: "none", marginBottom: 2,
                }}>
                  <div>
                    <div style={{ fontFamily: fonts.body, fontSize: 12.5, fontWeight: 500, color: "#334155" }}>{l.label}</div>
                    <div style={{ fontFamily: fonts.body, fontSize: 10.5, color: "#94A3B8" }}>{l.note}</div>
                  </div>
                  <div style={{ fontFamily: fonts.body, fontSize: 14, fontWeight: 700, color: "#2563EB", whiteSpace: "nowrap" }}>📞 {l.phone}</div>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* ══════ CATEGORY ══════ */}
        {page === "category" && (
          <div style={{ animation: "fadeIn 0.3s ease" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
              <button onClick={() => { setPage("home"); setSelectedCategory(null); setSearchTerm(""); }}
                style={{ background: "#FFF", border: "1px solid #E2E8F0", borderRadius: 9, padding: "7px 11px", cursor: "pointer", fontFamily: fonts.body, fontSize: 12.5, color: "#64748B" }}>← Back</button>
              {currentCat && <><span style={{ fontSize: 20 }}>{currentCat.icon}</span><h2 style={{ fontFamily: fonts.heading, fontSize: 19, fontWeight: 400, color: "#1E293B", margin: 0 }}>{currentCat.name}</h2></>}
              {!currentCat && searchTerm && <h2 style={{ fontFamily: fonts.heading, fontSize: 19, fontWeight: 400, color: "#1E293B", margin: 0 }}>Search results</h2>}
            </div>

            <div style={{ marginBottom: 12 }}>
              <div style={{ background: "#FFF", borderRadius: 11, padding: 3, border: "1px solid #E2E8F0", display: "flex", alignItems: "center" }}>
                <span style={{ padding: "0 9px", fontSize: 14, color: "#CBD5E1" }}>🔍</span>
                <input type="text" placeholder={currentCat ? `Search ${currentCat.name.toLowerCase()}...` : "Search..."} value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                  style={{ flex: 1, border: "none", outline: "none", padding: "9px 5px", fontSize: 13, fontFamily: fonts.body, background: "transparent", color: "#334155" }} />
                {searchTerm && <button onClick={() => setSearchTerm("")} style={{ background: "none", border: "none", cursor: "pointer", padding: "0 9px", fontSize: 12, color: "#CBD5E1" }}>✕</button>}
              </div>
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 14 }}>
              {CATEGORIES.map(cat => (
                <button key={cat.id} onClick={() => { setSelectedCategory(cat.id); setSearchTerm(""); }}
                  style={{
                    background: selectedCategory === cat.id ? cat.color : "#FFF",
                    color: selectedCategory === cat.id ? "#FFF" : "#64748B",
                    border: selectedCategory === cat.id ? `1.5px solid ${cat.color}` : "1.5px solid #E2E8F0",
                    borderRadius: 20, padding: "4px 11px", fontSize: 11, fontWeight: 500, fontFamily: fonts.body, cursor: "pointer", transition: "all 0.15s", whiteSpace: "nowrap",
                  }}>{cat.icon} {cat.name}</button>
              ))}
            </div>

            <p style={{ fontFamily: fonts.body, fontSize: 12, color: "#94A3B8", marginBottom: 10 }}>{filteredResources.length} resource{filteredResources.length !== 1 ? "s" : ""}{selectedRegion !== "all" && ` in ${currentRegion?.name}`}</p>

            {filteredResources.length === 0 ? (
              <div style={{ textAlign: "center", padding: "36px 18px", background: "#FFF", borderRadius: 16 }}>
                <div style={{ fontSize: 34, marginBottom: 10 }}>🔍</div>
                <p style={{ fontFamily: fonts.heading, fontSize: 16, color: "#1E293B", margin: "0 0 5px 0" }}>No resources found</p>
                <p style={{ fontFamily: fonts.body, fontSize: 12.5, color: "#94A3B8", margin: 0 }}>Try "All of British Columbia" or a different category</p>
              </div>
            ) : filteredResources.map(r => {
              const cat = CATEGORIES.find(c => c.id === r.category);
              return <ResourceCard key={r.id} resource={r} categoryColor={cat.color} categoryIcon={cat.icon} />;
            })}
          </div>
        )}

        {/* ══════ EVENTS (AI-powered) ══════ */}
        {page === "events" && (
          <div style={{ animation: "fadeIn 0.3s ease" }}>
            <div style={{ textAlign: "center", marginBottom: 18 }}>
              <h2 style={{ fontFamily: fonts.heading, fontSize: 20, fontWeight: 400, color: "#1E293B", margin: "0 0 5px 0" }}>📅 Upcoming Events & Workshops</h2>
              <p style={{ fontFamily: fonts.body, fontSize: 12.5, color: "#64748B", margin: 0 }}>Workshops, training, support groups & more across BC</p>
              <p style={{ fontFamily: fonts.body, fontSize: 10.5, color: "#94A3B8", marginTop: 4 }}>✨ Events are searched fresh from the web each visit</p>
            </div>

            {/* Event type legend */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16, justifyContent: "center" }}>
              {[{ type: "workshop", label: "Workshop", c: "#2E86AB" }, { type: "training", label: "Training", c: "#7E57C2" }, { type: "drop-in", label: "Drop-in", c: "#3A9E6E" }, { type: "program", label: "Program", c: "#E67E22" }, { type: "conference", label: "Conference", c: "#D94F4F" }, { type: "info", label: "Info Session", c: "#3498DB" }, { type: "support-group", label: "Support Group", c: "#C48B5C" }].map(t => (
                <span key={t.type} style={{ display: "inline-flex", alignItems: "center", gap: 4, fontFamily: fonts.body, fontSize: 10.5, color: "#64748B" }}>
                  <span style={{ width: 7, height: 7, borderRadius: "50%", background: t.c, display: "inline-block" }} />{t.label}
                </span>
              ))}
            </div>

            {/* Loading state */}
            {eventsLoading && (
              <div style={{ textAlign: "center", padding: "48px 20px" }}>
                <div style={{ marginBottom: 16 }}>
                  <div style={{
                    width: 48, height: 48, border: "4px solid #E2E8F0", borderTopColor: "#4A7C6F",
                    borderRadius: "50%", margin: "0 auto",
                    animation: "spin 1s linear infinite",
                  }} />
                  <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                </div>
                <p style={{ fontFamily: fonts.heading, fontSize: 17, color: "#1E293B", margin: "0 0 6px 0" }}>Finding upcoming events...</p>
                <p style={{ fontFamily: fonts.body, fontSize: 13, color: "#94A3B8", margin: 0 }}>Searching CMHA, Foundry, BCACC, and other BC mental health organizations</p>
                <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 8 }}>
                  {[1,2,3].map(i => (
                    <div key={i} style={{
                      background: "#FFF", borderRadius: 16, height: 80, overflow: "hidden",
                      display: "flex", opacity: 0.6,
                    }}>
                      <div style={{ width: 68, background: `linear-gradient(135deg, #E2E8F0, #CBD5E1)`, animation: `pulse ${1 + i * 0.2}s ease-in-out infinite` }} />
                      <div style={{ flex: 1, padding: 14, display: "flex", flexDirection: "column", gap: 8 }}>
                        <div style={{ height: 14, background: "#F1F5F9", borderRadius: 6, width: `${70 + i * 10}%` }} />
                        <div style={{ height: 10, background: "#F1F5F9", borderRadius: 6, width: "50%" }} />
                      </div>
                    </div>
                  ))}
                  <style>{`@keyframes pulse { 0%,100% { opacity: 0.5; } 50% { opacity: 0.8; } }`}</style>
                </div>
              </div>
            )}

            {/* Error / empty state */}
            {!eventsLoading && eventsError && (
              <div style={{ textAlign: "center", padding: "40px 20px", background: "#FFF", borderRadius: 16 }}>
                <div style={{ fontSize: 36, marginBottom: 12 }}>🔍</div>
                <p style={{ fontFamily: fonts.heading, fontSize: 16, color: "#1E293B", margin: "0 0 6px 0" }}>Couldn't load events right now</p>
                <p style={{ fontFamily: fonts.body, fontSize: 13, color: "#94A3B8", margin: "0 0 16px 0" }}>This can happen if the search takes too long. You can try again or check these sites directly.</p>
                <button onClick={() => { setEventsFetched(false); }} style={{
                  background: "#2E4057", color: "#FFF", border: "none", borderRadius: 10, padding: "10px 20px",
                  fontFamily: fonts.body, fontSize: 13, fontWeight: 600, cursor: "pointer", marginBottom: 16,
                }}>Try again</button>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {[
                    { label: "CMHA BC Events", href: "https://bc.cmha.ca/events/" },
                    { label: "Foundry Workshops", href: "https://foundrybc.ca/virtual/groups-workshops/" },
                    { label: "HelpStartsHere", href: "https://www.helpstartshere.gov.bc.ca" },
                  ].map((l, i) => (
                    <a key={i} href={l.href} target="_blank" rel="noopener noreferrer" style={{ fontFamily: fonts.body, fontSize: 13, color: "#2563EB", fontWeight: 600, textDecoration: "none" }}>{l.label} →</a>
                  ))}
                </div>
              </div>
            )}

            {/* Events list */}
            {!eventsLoading && !eventsError && filteredEvents.length > 0 && (
              <>
                <p style={{ fontFamily: fonts.body, fontSize: 12, color: "#94A3B8", marginBottom: 10 }}>
                  Found <strong style={{ color: "#334155" }}>{filteredEvents.length}</strong> upcoming event{filteredEvents.length !== 1 ? "s" : ""}
                </p>
                {filteredEvents.map(e => <EventCard key={e.id} event={e} />)}

                <div style={{ textAlign: "center", marginTop: 12 }}>
                  <button onClick={() => { setEventsFetched(false); }} style={{
                    background: "none", border: "1px solid #E2E8F0", borderRadius: 10, padding: "8px 16px",
                    fontFamily: fonts.body, fontSize: 12, color: "#64748B", cursor: "pointer",
                  }}>🔄 Refresh events</button>
                </div>
              </>
            )}

            {/* Always show direct links */}
            <div style={{ marginTop: 18, padding: "14px 16px", background: "#FFF", borderRadius: 13, border: "1px solid #E2E8F0", textAlign: "center" }}>
              <p style={{ fontFamily: fonts.body, fontSize: 11.5, color: "#94A3B8", margin: "0 0 7px 0" }}>Browse events directly:</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
                {[{ label: "CMHA BC Events", href: "https://bc.cmha.ca/events/" }, { label: "Foundry Workshops", href: "https://foundrybc.ca/virtual/groups-workshops/" }, { label: "HelpStartsHere", href: "https://www.helpstartshere.gov.bc.ca" }].map((l, i) => (
                  <a key={i} href={l.href} target="_blank" rel="noopener noreferrer" style={{ fontFamily: fonts.body, fontSize: 11.5, color: "#2563EB", textDecoration: "none", fontWeight: 600 }}>{l.label} →</a>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* FOOTER */}
        <div style={{ marginTop: 32, padding: "18px", background: "rgba(255,255,255,0.45)", borderRadius: 16, textAlign: "center" }}>
          <p style={{ fontFamily: fonts.body, fontSize: 11.5, color: "#94A3B8", lineHeight: 1.7, margin: 0 }}>
            This directory is for informational purposes. For the most current listings, visit{" "}
            <a href="https://www.helpstartshere.gov.bc.ca" target="_blank" rel="noopener noreferrer" style={{ color: "#2E86AB" }}>HelpStartsHere.gov.bc.ca</a>.
            <br /><br /><strong style={{ color: "#475569" }}>If you are in immediate danger, call 911.</strong>
            <br /><br /><span style={{ fontSize: 10.5, color: "#CBD5E1" }}>We respectfully acknowledge the Indigenous peoples on whose traditional, unceded territories British Columbians live, work, and play.</span>
          </p>
        </div>
      </div>
    </div>
  );
}
