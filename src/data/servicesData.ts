export interface ServiceDetail {
  slug: string;
  title: string;
  overview: string;
  features: string[];
  benefits: string[];
  eligibility: string[];
  documents: string[];
  interestRate?: string;
  processingTime?: string;
  emiExample?: string;
  process?: string[]; // for account opening
  faqs: { q: string; a: string }[];
}

export const LOAN_PRODUCTS: ServiceDetail[] = [
  {
    slug: "personal-loan",
    title: "Personal Loan",
    overview: "Get quick, collateral-free funds for personal emergencies, medical expenses, weddings, or vacations with flexible repayment tenures.",
    features: [
      "No security or collateral required",
      "Loan amount up to ₹25 Lakhs",
      "Flexible repayment options from 12 to 60 months",
      "Minimal documentation and quick processing"
    ],
    benefits: [
      "Instant disbursement to bank account",
      "Competitive interest rates starting from 10.5%",
      "Special offers for salaried professionals",
      "Easy online application and tracking"
    ],
    eligibility: [
      "Age: 21 to 60 years",
      "Employment Type: Salaried or Self-Employed",
      "Minimum Net Monthly Income: ₹25,000",
      "Credit Score: 700 or above"
    ],
    documents: [
      "Identity Proof (PAN Card, Aadhaar Card, Passport)",
      "Address Proof (Utility Bills, Rent Agreement)",
      "Income Proof (Latest 3 months salary slips, 6 months bank statement)",
      "Form 16 or Income Tax Return (ITR)"
    ],
    interestRate: "10.50% - 16.00% p.a.",
    processingTime: "24 to 48 Hours",
    emiExample: "For ₹5,00,000 loan at 10.5% interest for 5 years, the EMI is ₹10,747 per month.",
    faqs: [
      { q: "What is the maximum loan amount I can get?", a: "You can apply for personal loans up to ₹25 Lakhs depending on your eligibility, income, and repayment capacity." },
      { q: "Is collateral required?", a: "No, a personal loan is unsecured, meaning no collateral or security is needed." }
    ]
  },
  {
    slug: "home-loan",
    title: "Home Loan",
    overview: "Fulfill your dream of owning a home with our customized housing finance solutions offering low interest rates and long tenures.",
    features: [
      "Long repayment tenure up to 30 years",
      "Financing up to 90% of property cost",
      "Option to purchase new, resale, or construct homes",
      "Easy balance transfer options available"
    ],
    benefits: [
      "Lower EMIs over extended repayment terms",
      "Tax benefits under Section 80C and 24(b) of IT Act",
      "Doorstep service and minimal documentation",
      "No prepayment charges on floating rate loans"
    ],
    eligibility: [
      "Age: 21 to 65 years",
      "Employment Type: Salaried, Self-Employed Professional, or Business Person",
      "Steady regular source of income",
      "Valid property documentation with clear title"
    ],
    documents: [
      "Identity and Address Proof",
      "Salary Slips & Form 16 / Business ITR (last 2 years)",
      "Last 6 months Bank Statements showing income details",
      "Property Papers (Allotment letter, Sale Deed, Title documents)"
    ],
    interestRate: "8.40% - 9.50% p.a.",
    processingTime: "5 to 7 Working Days",
    emiExample: "For ₹30,00,000 home loan at 8.4% interest for 20 years, the EMI is ₹25,845 per month.",
    faqs: [
      { q: "Can I get a home loan for renovation?", a: "Yes, we offer specialized home improvement and renovation loans at competitive home loan rates." },
      { q: "Are co-applicants required?", a: "Co-applicants are recommended to increase loan eligibility, though they are not mandatory for all applicants." }
    ]
  },
  {
    slug: "business-loan",
    title: "Business Loan",
    overview: "Fuel your business expansion, purchase machinery, or manage seasonal cash flows with our unsecured and secured business loans.",
    features: [
      "Unsecured business loans up to ₹50 Lakhs",
      "Flexible repayment options from 12 to 36 months",
      "Easy online approval process",
      "Sovereign schemes integrated (e.g. Mudra Loans)"
    ],
    benefits: [
      "Zero collateral needed for unsecured loans",
      "Fast processing to meet urgent commercial needs",
      "Build corporate credit history",
      "Flexible withdrawal options"
    ],
    eligibility: [
      "Min. Business Vintage: 2 to 3 Years",
      "Minimum Annual Turnover: ₹15 Lakhs",
      "Profit-making business operations",
      "Good personal credit history of founders"
    ],
    documents: [
      "PAN Card & Aadhaar of Directors / Partners",
      "Business Registration Proof (GST Registration, Partnership Deed)",
      "Last 2 years Audited Financials & ITR",
      "Last 12 months Business Current Account statements"
    ],
    interestRate: "12.00% - 18.00% p.a.",
    processingTime: "3 to 4 Working Days",
    emiExample: "For ₹10,00,000 business loan at 13% interest for 3 years, the EMI is ₹33,694 per month.",
    faqs: [
      { q: "Is collateral necessary for all business loans?", a: "No, we offer unsecured business loans up to ₹50 Lakhs. Secured business options are available for higher amounts." },
      { q: "What is business vintage?", a: "It is the continuous duration of time your business has been actively registered and running." }
    ]
  },
  {
    slug: "education-loan",
    title: "Education Loan",
    overview: "Finance high-quality higher education in India or abroad with student loans covering tuition fees, travel, and accommodation expenses.",
    features: [
      "Covers up to 100% of education-related costs",
      "Moratorium period (course duration + up to 1 year)",
      "Repayment terms up to 15 years",
      "Subsidy schemes for eligible sections"
    ],
    benefits: [
      "Secures student's independent future",
      "Tax benefits under Section 80E on interest paid",
      "Quick visa approval support documents",
      "No security needed for loans up to ₹7.5 Lakhs"
    ],
    eligibility: [
      "Indian National student",
      "Secured admission in recognized college/university",
      "Co-borrower (parent/spouse/guardian) with steady income",
      "Applicable for undergraduate, postgraduate, or professional programs"
    ],
    documents: [
      "Admission letter from university with fee structure details",
      "Academic records (10th, 12th, graduation marksheets)",
      "Co-borrower Income Proof (ITR, salary slips, bank statements)",
      "Collateral security documents (if loan is above ₹7.5 Lakhs)"
    ],
    interestRate: "9.25% - 11.50% p.a.",
    processingTime: "4 to 6 Working Days",
    emiExample: "For ₹15,00,000 education loan at 9.5% interest for 10 years, the EMI is ₹19,414 per month after moratorium.",
    faqs: [
      { q: "What expenses are covered?", a: "Tuition fees, exam fees, hostel/accommodation expenses, purchase of books/laptop, and travel tickets for study abroad." },
      { q: "What is the moratorium period?", a: "It is a holiday period during which the student is not required to repay the principal amount. It spans the course duration plus 6 to 12 months." }
    ]
  },
  {
    slug: "gold-loan",
    title: "Gold Loan",
    overview: "Get instant cash against your gold ornaments with minimal paperwork and secure vault storage.",
    features: [
      "Instant valuation and cash disbursal",
      "Flexible repayment schemes (Interest-only, bullet payment, EMIs)",
      "High value per gram of gold",
      "No income proof or high credit score required"
    ],
    benefits: [
      "Gold is stored in ultra-secure, insured bank vaults",
      "Lower interest rates than unsecured loans",
      "Option to pay only interest monthly and principal at maturity",
      "Get back your gold ornaments immediately upon closure"
    ],
    eligibility: [
      "Age: 18 to 70 years",
      "Must own gold jewelry or ornaments of 18-24 carats purity",
      "Valid identity documents"
    ],
    documents: [
      "Identity Proof (PAN Card, Aadhaar Card, Passport)",
      "Address Proof",
      "Two passport-sized photographs"
    ],
    interestRate: "7.99% - 12.00% p.a.",
    processingTime: "30 to 45 Minutes",
    emiExample: "For ₹2,00,000 gold loan at 8.5% interest, you pay ₹1,417 monthly interest and the principal at the end of 1 year.",
    faqs: [
      { q: "Is my gold safe with you?", a: "Absolutely. All gold is sealed in high-security, fireproof bank vaults protected by 24/7 security and insured fully." },
      { q: "What happens if I miss interest payments?", a: "We provide reminders and grace periods, but persistent defaults may lead to auction of the gold assets after standard regulatory notifications." }
    ]
  },
  {
    slug: "vehicle-loan",
    title: "Vehicle Loan",
    overview: "Drive home your favorite car or two-wheeler with quick financing options and attractive interest packages.",
    features: [
      "Financing up to 90% of on-road vehicle price",
      "Tenure options up to 7 years",
      "Applicable for both new and pre-owned cars",
      "No foreclosure charges on select variants"
    ],
    benefits: [
      "Flexible payment modes",
      "Special partnerships with car dealers for discounts",
      "Fast digital processing and approvals",
      "Simple EMI plans matching your budget"
    ],
    eligibility: [
      "Age: 21 to 65 years",
      "Employment Type: Salaried or Self-Employed",
      "Minimum annual income of ₹3 Lakhs",
      "Clean credit and financial statement records"
    ],
    documents: [
      "Identity, Age, and Address proofs",
      "Income details: salary slips / audited business financials",
      "Latest 6 months bank statement showing regular earnings",
      "Proforma Invoice or Quotation of the vehicle from the dealer"
    ],
    interestRate: "8.75% - 10.25% p.a.",
    processingTime: "24 to 72 Hours",
    emiExample: "For ₹8,00,000 vehicle loan at 9.0% interest for 5 years, the EMI is ₹16,608 per month.",
    faqs: [
      { q: "Can I get a loan for a used car?", a: "Yes, we fund certified pre-owned vehicles with slightly adjusted age parameters up to 5 years." },
      { q: "What is on-road price financing?", a: "It covers the basic vehicle ex-showroom price, road tax, registration expenses, and vehicle insurance." }
    ]
  },
  {
    slug: "loan-against-property",
    title: "Loan Against Property",
    overview: "Unlock the hidden equity of your residential, commercial, or industrial property to finance your large-scale capital needs.",
    features: [
      "Up to 60-70% of market value of property",
      "Long repayment tenure up to 15 years",
      "Lower interest rates than personal or business loans",
      "Continued full use of property by owner"
    ],
    benefits: [
      "High quantum of loan amount up to ₹10 Crores",
      "Cheaper funding option for long-term expenses",
      "Consolidate multiple high-interest debts into one low EMI",
      "Easy processing and clear property verification guidelines"
    ],
    eligibility: [
      "Age: 21 to 65 years",
      "Property must have clear and marketable title documents",
      "Property should be structurally sound and free from legal disputes",
      "Co-applicants (usually property co-owners) must join the loan"
    ],
    documents: [
      "Property Sale Deed, Title Deeds, Approved plans, Tax receipts",
      "KYC proofs of all applicants",
      "Last 3 years audited financials and income tax documents",
      "Last 6 months active primary bank statement"
    ],
    interestRate: "9.00% - 11.50% p.a.",
    processingTime: "7 to 10 Working Days",
    emiExample: "For ₹50,00,000 loan against property at 9.5% interest for 15 years, the EMI is ₹52,211 per month.",
    faqs: [
      { q: "Can I still occupy or rent the property?", a: "Yes, the property owner retains full possession and usage rights of the property during the loan tenure." },
      { q: "Which property types are accepted?", a: "Residential buildings, self-occupied apartments, commercial shops, vacant non-agricultural lands, and industrial sheds." }
    ]
  },
  {
    slug: "msme-loan",
    title: "MSME Loan",
    overview: "Dedicated funding schemes tailored for Micro, Small, and Medium Enterprises to support startup scale-up, automation, and inventory.",
    features: [
      "Collateral-free CGTMSE options for loans up to ₹2 Crores",
      "Flexible repayment and overdraft mechanisms",
      "Special subsidy schemes for women-led startups",
      "Minimal verification requirements for verified GST filers"
    ],
    benefits: [
      "Empowers MSME units with low-cost resources",
      "Helps meet local manufacturing and import-export demand",
      "Eligible for governmental interest subvention schemes",
      "Promotes structural business scaling"
    ],
    eligibility: [
      "Must have valid MSME / Udyam Registration",
      "Active GST filings for last 1 year",
      "Clean track records with prior lending entities",
      "Positive net worth of the business structure"
    ],
    documents: [
      "Udyam registration certificate & GST returns",
      "Promoter ID and Address documentation",
      "Financial reports (Balance Sheet, Profit & Loss accounts)",
      "Bank statement of all corporate current accounts"
    ],
    interestRate: "9.50% - 13.00% p.a.",
    processingTime: "4 to 7 Working Days",
    emiExample: "For ₹25,00,000 MSME loan at 10.0% interest for 5 years, the EMI is ₹53,118 per month.",
    faqs: [
      { q: "What is CGTMSE scheme?", a: "It is a government trust scheme that offers credit guarantees to lenders, enabling them to offer collateral-free loans to eligible MSMEs." },
      { q: "Is Udyam registration compulsory?", a: "Yes, it is necessary to qualify for priority sector lending benefits and lower MSME interest rate structures." }
    ]
  },
  {
    slug: "working-capital-loan",
    title: "Working Capital Loan",
    overview: "Manage daily operating costs, trade payables, and inventory shortages with customized overdrafts and cash credit lines.",
    features: [
      "Overdraft (OD) / Cash Credit (CC) structures",
      "Interest charged only on the utilized credit balance",
      "Flexible limits based on receivable turnovers",
      "Repay and withdraw multiple times within limit"
    ],
    benefits: [
      "Seamless business operations and liquidity management",
      "Optimized interest payments based on cash cycle fluctuations",
      "Quick seasonal stocks purchasing capability",
      "Dedicated relationship manager support"
    ],
    eligibility: [
      "Business vintage of at least 3 years",
      "Audited financial accounts for last 2 fiscal cycles",
      "Healthy debt-to-equity ratio",
      "Regular cash receipts and payments cycles"
    ],
    documents: [
      "Partnership deed/MOA & Articles of association",
      "Stock and debtors statement checklist",
      "Last 12 months bank current account statement",
      "GST returns & audited tax filings"
    ],
    interestRate: "10.00% - 14.50% p.a. (on daily utilization)",
    processingTime: "5 to 7 Working Days",
    emiExample: "For ₹20,00,000 cash credit utilization at 11% for 15 days, the interest payable is ₹9,041.",
    faqs: [
      { q: "How is CC limit decided?", a: "It is determined based on your working capital gap, inventory levels, accounts receivable ledger, and annual sales volume." },
      { q: "Are annual renewals required?", a: "Yes, working capital limits are reviewed and renewed annually based on credit performance." }
    ]
  },
  {
    slug: "mortgage-loan",
    title: "Mortgage Loan",
    overview: "Secure long-term capital backing by mortgaging non-disputed real estate assets with structured payback schedules.",
    features: [
      "LTV ratios up to 75%",
      "Tenure options extending up to 20 years",
      "Available for both commercial and residential properties",
      "Simple, transparent verification procedures"
    ],
    benefits: [
      "Highly affordable interest structures compared to commercial loans",
      "Longer tenure terms lower monthly EMI obligation",
      "Funds can be used for mixed financial purposes",
      "Fast clearance process for verified land parcels"
    ],
    eligibility: [
      "Property owners with verified mutation records",
      "Sufficient residual value of property",
      "Stable tax filing history",
      "Co-borrowers must be property co-owners"
    ],
    documents: [
      "Original Title deeds & Registry papers",
      "Encumbrance certificate (EC) and layout plans",
      "Financial reports: salary certificates / income receipts",
      "KYC proofs of all applicants"
    ],
    interestRate: "8.90% - 11.00% p.a.",
    processingTime: "6 to 8 Working Days",
    emiExample: "For ₹40,00,000 mortgage loan at 9.0% interest for 15 years, the EMI is ₹40,571 per month.",
    faqs: [
      { q: "What is an Encumbrance Certificate?", a: "An EC proves that the mortgaged property is free from any previous legal liabilities, court attachments, or unpaid mortgages." },
      { q: "Is property valuation conducted?", a: "Yes, an independent bank-appointed appraiser conducts a market valuation of the property to establish the LTV limit." }
    ]
  }
];

export const FINANCE_SERVICES: ServiceDetail[] = [
  {
    slug: "credit-card",
    title: "Credit Card",
    overview: "Unlock exclusive rewards, cashback, travel vouchers, and shopping discounts with our global contactless credit cards.",
    features: [
      "Welcome reward points & travel vouchers",
      "Up to 50 days interest-free credit period",
      "Convert transactions into easy monthly EMIs",
      "Contactless secure payment technologies"
    ],
    benefits: [
      "Earn cashback on daily spends",
      "Complimentary airport lounge access globally",
      "Zero liability on lost cards after instant reporting",
      "Instant fuel surcharge waivers at fuel stations"
    ],
    eligibility: [
      "Age: 21 to 65 years",
      "Minimum monthly income: ₹20,000 (Salaried) / ITR ₹4 Lakhs (Self-employed)",
      "Resident of India",
      "Good credit history"
    ],
    documents: [
      "Identity Proof (PAN Card, Aadhaar Card)",
      "Address Proof (Passport, Driving License, Voter Card)",
      "Latest 3 months salary slips or ITR",
      "Recent passport-sized color photograph"
    ],
    faqs: [
      { q: "What is the annual fee?", a: "Fees vary from lifetime free cards to custom premium cards. Annual fees are waived off upon reaching milestones." },
      { q: "How are interest-free days calculated?", a: "The interest-free period can span up to 50 days depending on the date of your purchase and your monthly card billing cycle." }
    ]
  },
  {
    slug: "insurance",
    title: "Insurance Policies",
    overview: "Protect your family, health, and assets with our comprehensive insurance plans featuring simple claims processes.",
    features: [
      "Complete life cover and high-term insurance benefits",
      "Cashless health insurance network covering 10,000+ hospitals",
      "Comprehensive vehicle and motor policies",
      "Instant online policy generation and renewal"
    ],
    benefits: [
      "Peace of mind for family against unforeseen events",
      "Tax saving deductions under Section 80C and 80D",
      "Add-on riders like critical illness & personal accident cover",
      "Fast cashless claim approvals within hours"
    ],
    eligibility: [
      "Age: 18 to 65 years (varies per policy)",
      "Satisfactory medical screening for high-value health policies",
      "Resident Indian or NRI status"
    ],
    documents: [
      "KYC documentation (PAN, Aadhaar)",
      "Age proof certificate (Birth certificate, school leaving certificate)",
      "Income proof documents for life term policies",
      "Prior health check reports (if applicable)"
    ],
    faqs: [
      { q: "What is cashless hospital claim?", a: "Under cashless cover, you do not pay hospital bills directly. The insurance company pays the hospital directly on your behalf." },
      { q: "Can I renew the policy online?", a: "Yes, you can renew all policies instantly online through our payment gateway." }
    ]
  },
  {
    slug: "mutual-funds",
    title: "Mutual Funds",
    overview: "Grow your wealth through professionally managed portfolios investing in equities, debt, and money-market instruments.",
    features: [
      "Diversified asset allocation in multiple sectors",
      "Invest in large-cap, mid-cap, small-cap, or hybrid funds",
      "Expert fund managers handling the investments",
      "High liquidity – redeem funds at prevailing NAVs"
    ],
    benefits: [
      "Lower investment risk through asset diversification",
      "Higher return potential than traditional savings",
      "Tax-saving mutual funds (ELSS) options",
      "Start investing with as low as ₹500 per month"
    ],
    eligibility: [
      "Indian Resident or NRI",
      "Must be KYC compliant (verified PAN and Aadhaar link)",
      "Age: 18 years and above (parents can invest for minors)"
    ],
    documents: [
      "PAN Card photocopy",
      "Aadhaar Card copy",
      "Valid bank account with cancelled cheque for mandate setup"
    ],
    faqs: [
      { q: "What is NAV?", a: "Net Asset Value (NAV) is the market value of one unit of the mutual fund scheme, updated daily after market close." },
      { q: "Are mutual fund returns guaranteed?", a: "No, mutual fund investments are subject to market risks, and returns fluctuate based on portfolio asset performance." }
    ]
  },
  {
    slug: "sip-investment",
    title: "SIP Investment",
    overview: "Build disciplined wealth by auto-investing a fixed amount regularly in chosen mutual fund schemes.",
    features: [
      "Automated monthly/weekly auto-debits from bank accounts",
      "Benefit from rupee cost averaging",
      "Power of compounding over long tenures",
      "Flexibility to pause, modify, or stop SIPs anytime"
    ],
    benefits: [
      "Promotes savings discipline",
      "No need to time the market cycles",
      "Invest small, comfortable amounts consistently",
      "Goal-based planning (e.g. Retirement, Child Education)"
    ],
    eligibility: [
      "Valid PAN Card",
      "KYC compliant registration status",
      "Active bank account with auto-debit support"
    ],
    documents: [
      "PAN & Aadhaar details",
      "Bank Account details & verified ECS/NACH debit mandate"
    ],
    faqs: [
      { q: "Can I skip a month's payment?", a: "Yes, you can temporarily pause your SIP through the investment console without any penalty charges." },
      { q: "What is Rupee Cost Averaging?", a: "When market prices fall, your fixed SIP buys more mutual fund units, and when markets rise, it buys fewer units, averaging out costs over time." }
    ]
  },
  {
    slug: "fixed-deposit",
    title: "Fixed Deposit",
    overview: "Earn assured, high-yield interest on your savings with maximum security and flexible payout options.",
    features: [
      "Guaranteed returns unaffected by market fluctuations",
      "Flexible tenures from 7 days to 10 years",
      "Options for cumulative or monthly/quarterly interest payouts",
      "Premature withdrawal facilities available"
    ],
    benefits: [
      "Highest safety rank for capital protection",
      "Higher interest rates for senior citizens (+0.50%)",
      "Avail overdraft or loan up to 90% of your FD value",
      "Tax saver FDs available with a 5-year lock-in"
    ],
    eligibility: [
      "Resident Indians, HUFs, Sole Proprietors, Partnership Firms, Companies",
      "Minors can open accounts jointly with guardians"
    ],
    documents: [
      "KYC Proofs (PAN, Aadhaar)",
      "FD Application form",
      "Cheque/Online transfer transaction receipt for deposit amount"
    ],
    faqs: [
      { q: "Is TDS applicable on FD interest?", a: "Yes, TDS is deducted if interest income exceeds ₹40,000 (₹50,000 for senior citizens) in a financial year, unless Form 15G/15H is submitted." },
      { q: "Can I break my FD early?", a: "Yes, premature withdrawal is allowed, though it may attract a minor interest penalty as per bank rules." }
    ]
  },
  {
    slug: "financial-planning",
    title: "Financial Planning",
    overview: "Get expert advice to structure your wealth, optimize tax payments, and plan for retirement and major milestones.",
    features: [
      "Personalized financial health auditing",
      "Goal-based investment structuring guidelines",
      "Retirement corpus building models",
      "Asset allocation optimization strategies"
    ],
    benefits: [
      "Structured roadmap to financial freedom",
      "Optimized portfolios based on individual risk tolerance",
      "Ensure sufficient liquidity for life milestones",
      "Effective legacy and estate inheritance planning"
    ],
    eligibility: [
      "Anyone seeking to organize and grow their savings, income, and assets"
    ],
    documents: [
      "Current asset portfolio summary details",
      "Income tax files, annual budgets, liabilities sheets"
    ],
    faqs: [
      { q: "How often should I review my plan?", a: "We recommend reviewing your financial plan annually or whenever you experience major life changes (like marriage, career changes, or child births)." }
    ]
  },
  {
    slug: "tax-saving",
    title: "Tax Saving Schemes",
    overview: "Maximize your take-home income by investing in tax-exempt schemes under Section 80C and other provisions.",
    features: [
      "Access to ELSS Mutual funds, PPF, and National Pension Scheme (NPS)",
      "High yield tax-saver FDs",
      "Deductions on health premiums and education loan interests",
      "Detailed advisory on old vs. new tax regimes"
    ],
    benefits: [
      "Save up to ₹46,800 in taxes annually",
      "Earn attractive interest yields while saving tax",
      "Ensures planned growth of long-term funds",
      "Clean, legal tax optimization advisory"
    ],
    eligibility: [
      "Individual taxpayers and HUFs registered in India"
    ],
    documents: [
      "PAN Card & Aadhaar details",
      "Income details (Form 16 or ITR statement)"
    ],
    faqs: [
      { q: "What is Section 80C limit?", a: "Under Section 80C, you can claim deductions up to ₹1.5 Lakhs per financial year by investing in eligible instruments like ELSS, PPF, EPF, and Life Insurance." }
    ]
  },
  {
    slug: "business-finance",
    title: "Business Finance",
    overview: "Fuel corporate growth, fund mergers, or procure raw materials with our customized corporate finance and term lending options.",
    features: [
      "Structured term loans and project financing",
      "Letter of Credit (LC) and Bank Guarantees (BG)",
      "Customized financial structuring for SME corporate units",
      "Competitive rate profiles with flexible amortization terms"
    ],
    benefits: [
      "Ensures business expansion doesn't hit cash blocks",
      "Facilitates international trade and procurement with bank backed guarantees",
      "Tax deductions on corporate interest payments",
      "Robust advisory services"
    ],
    eligibility: [
      "Registered private/public limited firms or LLP companies",
      "Audited company books with clear revenue history",
      "Satisfactory commercial credit rating (e.g. CRISIL)"
    ],
    documents: [
      "Company Registration certificate, MOA & AOA documents",
      "Last 3 years audited financials & corporate tax returns",
      "Bank statement records & details of current liabilities"
    ],
    faqs: [
      { q: "What is a Letter of Credit?", a: "It is a bank document guaranteeing that a buyer's payment to a seller will be made on time and for the correct amount, facilitating secure B2B trade." }
    ]
  },
  {
    slug: "commercial-finance",
    title: "Commercial Finance",
    overview: "Acquire commercial spaces, expand warehouse logistics, or manage supply chains with structured property financing.",
    features: [
      "High-value real estate property funding",
      "Warehouse and inventory financing",
      "Supply chain and invoice discounting facilities",
      "Long tenure payback structures"
    ],
    benefits: [
      "Own your office spaces instead of paying high rent",
      "Improve operational margins with prompt invoice cash flow release",
      "Structured liquidity support mapped to seasonal requirements",
      "Custom interest and repayment structures"
    ],
    eligibility: [
      "Proprietors, partners, LLPs, or corporate entities",
      "Minimum 3 years profitable track record",
      "Clear title for commercial properties being mortgaged"
    ],
    documents: [
      "Property deeds and approved layout plans",
      "Commercial entity registry proofs & tax certificates",
      "Audited reports & bank statement portfolios"
    ],
    faqs: [
      { q: "What is invoice discounting?", a: "It is a commercial funding tool where businesses borrow money against their outstanding sales invoices to get instant working capital before customers pay." }
    ]
  },
  {
    slug: "equipment-finance",
    title: "Equipment Finance",
    overview: "Acquire heavy machinery, medical equipment, or IT hardware with tailored equipment loans and leasing models.",
    features: [
      "Loan covering up to 80-90% of equipment cost",
      "Machinery itself acts as the primary security",
      "Flexible lease-to-own options",
      "Amortization matches equipment life cycles"
    ],
    benefits: [
      "Acquire high-tech machinery without large cash outflows",
      "Preserves capital for day-to-day operations",
      "Tax benefits on depreciation and interest costs",
      "Avoid obsolescence through leasing upgrades"
    ],
    eligibility: [
      "Manufacturing, construction, medical, or corporate units",
      "Satisfactory operations vintage of 2+ years",
      "Clear vendor quotations for the machines being financed"
    ],
    documents: [
      "Vendor quotation and machinery catalog specifications",
      "Corporate registration proofs and board resolutions",
      "Income tax returns and audited statements",
      "Latest 6 months bank statement records"
    ],
    faqs: [
      { q: "Is third-party collateral required?", a: "Usually no, as the financed machine/equipment itself is hypothecated as the primary security for the loan." }
    ]
  }
];

export const ACCOUNT_SERVICES: ServiceDetail[] = [
  {
    slug: "savings-account",
    title: "Savings Account",
    overview: "Safeguard your funds while earning competitive interest, with access to instant digital banking, cards, and reward systems.",
    features: [
      "High interest yields on daily balances",
      "Free international contactless debit card",
      "Unlimited transactions via NetBanking & mobile app",
      "Instant money transfers via UPI, NEFT, IMPS, RTGS"
    ],
    benefits: [
      "Discounts and reward points on shopping transactions",
      "Access to safe deposit locker facilities",
      "Free monthly e-statements",
      "Complementary personal accident insurance on debit card"
    ],
    eligibility: [
      "Indian Resident Individual",
      "Age: 18 years and above (minor accounts can be opened with parents)",
      "Foreign nationals residing in India with valid visa approvals"
    ],
    documents: [
      "Aadhaar Card & PAN Card",
      "Recent passport-sized photographs",
      "Address validation (Utility bill, Driving license if different from Aadhaar)"
    ],
    process: [
      "Choose your savings account variant online or at a branch",
      "Fill out the digital application form & upload KYC documentation",
      "Complete instant Video KYC verification or face-to-face check",
      "Make your initial minimum funding deposit to activate the account",
      "Receive your starter kit containing checkbook, debit card, and logins"
    ],
    faqs: [
      { q: "What is Video KYC?", a: "It is a fully digital face-to-face verification process conducted via a video call with a bank representative, eliminating the need to visit a branch." },
      { q: "Are there minimum balance requirements?", a: "Requirements depend on the account type. We offer both zero-balance and standard average monthly balance accounts." }
    ]
  },
  {
    slug: "current-account",
    title: "Current Account",
    overview: "Designed for business professionals, retailers, and corporates to manage high-volume daily cash receipts and bulk payments.",
    features: [
      "Unlimited cash deposits and withdrawals",
      "Dynamic overdraft facility options",
      "Bulk payout processing portals (NEFT/RTGS/IMPS)",
      "Dedicated corporate internet banking login credentials"
    ],
    benefits: [
      "Smooth B2B trading with high transaction limits",
      "Free cash deposit limits at local branches",
      "Integrated payment gateways for retail setups",
      "Dedicated corporate relationship manager support"
    ],
    eligibility: [
      "Sole Proprietors, Partnership Firms, LLPs, Private/Public Ltd Companies, Trusts"
    ],
    documents: [
      "Entity Registration proofs (GST, Shop Act License)",
      "Partnership deed/MOA & AOA documents",
      "KYC proofs of promoters / authorized signatories",
      "PAN Card of the firm/business entity"
    ],
    process: [
      "Submit business registration documents online or at a branch",
      "Verify signatory details and specify operational guidelines",
      "Complete corporate verification steps",
      "Fund the initial current account balance",
      "Receive checkbooks, corporate debit cards, and netbanking credentials"
    ],
    faqs: [
      { q: "What is an overdraft facility?", a: "It allows current account holders to withdraw money beyond their balance up to a approved credit limit to manage temporary business cash gaps." }
    ]
  },
  {
    slug: "salary-account",
    title: "Salary Account",
    overview: "A premium corporate account to credit employee salaries, bundled with zero balance benefits and customized loan offers.",
    features: [
      "Zero balance requirements (no monthly balance penalties)",
      "Free platinum debit card with unlimited ATM transactions",
      "Attractive loan offers and overdrafts based on monthly salary slips",
      "Complimentary personal accident cover"
    ],
    benefits: [
      "No maintenance charge pressure",
      "Cashback and high reward points on card spends",
      "Special discounts on locker rentals and home loan rates",
      "Preferential rates on foreign exchange transactions"
    ],
    eligibility: [
      "Salaried individual employed with a registered company/corporation",
      "Official salary credit mandate from the employer"
    ],
    documents: [
      "KYC documents (Aadhaar & PAN)",
      "Employer identity card / official letter of employment",
      "Recent salary slips or copy of appointment letter"
    ],
    process: [
      "Corporate tie-up representative initiates online onboarding link",
      "Employee inputs KYC details and registers signature digitally",
      "Uploads employment proof and Aadhaar details",
      "Completes instant Video KYC",
      "Account is activated instantly for salary credits"
    ],
    faqs: [
      { q: "What if no salary is credited for 3 months?", a: "If salary credits stop for 3 consecutive months, the account is converted into a standard savings account, and regular balance rules will apply." }
    ]
  },
  {
    slug: "zero-balance-account",
    title: "Zero Balance Account",
    overview: "Enjoy the freedom of banking without worrying about maintaining a minimum balance, with full digital access.",
    features: [
      "No average monthly balance requirements",
      "Free virtual debit card for online shopping",
      "Instant online mobile banking activation",
      "UPI payments and transfer integrations enabled"
    ],
    benefits: [
      "No penalty charges for zero balances",
      "Simple, fully digital account opening within 5 minutes",
      "Earn standard savings interest on any funds kept",
      "Access to all basic banking services without extra fees"
    ],
    eligibility: [
      "Indian Resident Individual",
      "Age: 18 years and above",
      "Must have active Aadhaar and PAN cards"
    ],
    documents: [
      "Aadhaar Card number",
      "PAN Card number",
      "Aadhaar-linked mobile number for OTP signature verification"
    ],
    process: [
      "Go to the Zero Balance registration screen on our app/website",
      "Enter PAN, Aadhaar, and verify with OTP",
      "Input basic profile details and set nominee details",
      "Complete short video call for KYC verification",
      "Account is immediately ready with online logins"
    ],
    faqs: [
      { q: "Are there hidden charges?", a: "No, there are no maintenance charges. Standard charges apply only for physical checkbooks or physical card issuances if requested." }
    ]
  },
  {
    slug: "demat-account",
    title: "Demat Account",
    overview: "Hold your stocks, mutual funds, ETFs, and bonds in a secure, digital format for easy trading and management.",
    features: [
      "Safe, digital custody of your securities",
      "Instant allocation of stocks and mutual fund holdings",
      "Automatic credit of corporate benefits like dividends and splits",
      "Zero account opening charges options"
    ],
    benefits: [
      "Eliminates paper certificate storage risks",
      "Faster trade settlement cycles",
      "Easy online portfolio tracking and tax calculations",
      "Seamless integration with trading and bank accounts"
    ],
    eligibility: [
      "Indian Resident, HUF, NRI, or Corporate",
      "Minors can open demat accounts under guardian supervision"
    ],
    documents: [
      "PAN Card (Mandatory for trading/demat in India)",
      "Aadhaar Card validation",
      "Address proof & Bank account verification (cancelled cheque / statement)"
    ],
    process: [
      "Initiate Demat registration online",
      "Input bank account details to link for funding/payouts",
      "Upload signature image and address documents",
      "Complete Video KYC / In-Person Verification (IPV)",
      "Digitally sign the document with Aadhaar OTP to open demat"
    ],
    faqs: [
      { q: "What is dematerialization?", a: "It is the process of converting physical paper share certificates into electronic format in a Demat account." }
    ]
  },
  {
    slug: "trading-account",
    title: "Trading Account",
    overview: "Trade equities, futures, options, commodities, and currencies across NSE, BSE, and MCX with our advanced trading systems.",
    features: [
      "Real-time market streaming charts & advanced analytics",
      "Ultra-low latency trade execution speeds",
      "Multiple order types (Bracket orders, cover orders, stop-loss)",
      "Integrated research reports and market tips"
    ],
    benefits: [
      "Trade on both desktop web and mobile application screens",
      "Low brokerage charge models",
      "High leverage availability for intraday trading",
      "One-click fund transfer from linked bank accounts"
    ],
    eligibility: [
      "Individuals above 18 years of age with a valid PAN card and active Demat account"
    ],
    documents: [
      "PAN Card details",
      "Income proof (6 months bank statement / ITR / Form 16) for derivatives trading",
      "Linked bank account proof"
    ],
    process: [
      "Select trading account variant online",
      "Submit PAN and complete basic profiles",
      "Upload address verification and signatures",
      "Link your bank and demat accounts",
      "Verify with Aadhaar OTP to activate trading"
    ],
    faqs: [
      { q: "Is income proof mandatory?", a: "Income proof is only mandatory if you wish to trade in Futures & Options (F&O) or Commodity derivatives." }
    ]
  },
  {
    slug: "nri-account",
    title: "NRI Account",
    overview: "Tailored NRE/NRO banking accounts for Non-Resident Indians to manage foreign earnings and local Indian incomes seamlessly.",
    features: [
      "NRE (Non-Resident External) account for foreign savings",
      "NRO (Non-Resident Ordinary) account for Indian local income",
      "Tax-free interest income in India on NRE balances",
      "Easy repatriation of funds overseas"
    ],
    benefits: [
      "Maintain savings in Indian Rupees",
      "Freely repatriate NRE principal and interest amount",
      "Pay local Indian bills (insurance, property tax) via NRO",
      "Joint accounts allowed with resident Indian relatives"
    ],
    eligibility: [
      "Non-Resident Indian (NRI) or Person of Indian Origin (PIO/OCI)"
    ],
    documents: [
      "Valid Indian Passport / OCI card copy",
      "Overseas address proof (Utility bills, lease agreement)",
      "Valid employment visa or work permit copy",
      "FATCA declaration (if applicable)"
    ],
    process: [
      "Fill out the NRI Account application form online",
      "Upload scanned copies of passport, visa, and overseas address proof",
      "Documents must be self-attested or notarized by embassy/consulate",
      "Complete online verification call",
      "Courier physical forms if necessary or complete secure digital validation"
    ],
    faqs: [
      { q: "What is the difference between NRE and NRO?", a: "NRE is used to deposit foreign earnings and is fully repatriable and tax-free in India. NRO is used to manage income earned in India (like rent or pension) and is subject to local taxes." }
    ]
  }
];
