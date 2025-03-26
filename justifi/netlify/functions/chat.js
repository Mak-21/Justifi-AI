const { GoogleGenerativeAI } = require("@google/generative-ai");

exports.handler = async function(event, context) {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };
  
  // Handle preflight OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  try {
    // Parse request body
    const { prompt } = JSON.parse(event.body);
    
    console.log("Received prompt:", prompt);
    
    // Create mock responses based on keywords
    const mockResponses = {
      "tenant": `## Tenant Rights Overview

Tenants have several important rights under federal law and most state laws:

* **Fair Housing Protections**: The **Fair Housing Act** (*42 U.S. Code § 3604*) prohibits discrimination based on race, color, national origin, religion, sex, familial status, or disability
* **Habitable Living Conditions**: Landlords must provide housing that meets basic health and safety standards
* **Privacy Rights**: Landlords typically must provide reasonable notice before entering your rental unit
* **Security Deposit Protection**: Most states have laws governing how security deposits are handled and returned

## Security Deposits

Security deposit laws vary by state, but generally:

* Landlords must return deposits within a specific timeframe (typically 14-60 days)
* Landlords must provide itemized deductions for any money withheld
* Some states limit how much can be charged (commonly 1-2 months' rent)

## Eviction Protections

Landlords must follow proper legal procedures for eviction:

* Written notice must be provided before eviction proceedings
* Formal court proceedings are required
* **Self-help evictions** (changing locks, removing belongings, shutting off utilities) are illegal

For specific protections in your state, contact a local tenant rights organization or legal aid society.`,

      "copyright": `## Copyright Law Fundamentals

Copyright is a form of intellectual property protection granted by law for original works of authorship fixed in a tangible medium of expression.

### Works Protected by Copyright

Copyright protection extends to these categories:

* Literary works
* Musical works
* Dramatic works
* Pictorial, graphic, and sculptural works
* Motion pictures and audiovisual works
* Sound recordings
* Architectural works

### Rights Granted by Copyright

Copyright owners have these **exclusive rights** under *17 U.S. Code § 106*:

* Reproduce the work
* Prepare derivative works
* Distribute copies
* Perform the work publicly
* Display the work publicly

### Fair Use Doctrine

The **fair use doctrine** (*17 U.S. Code § 107*) allows limited use of copyrighted material without permission for purposes such as:

* Criticism
* Comment
* News reporting
* Teaching
* Scholarship
* Research

Courts evaluate four factors when determining fair use:
1. Purpose and character of the use
2. Nature of the copyrighted work
3. Amount used relative to the whole
4. Effect on the potential market for the work

### Duration of Copyright

For works created after January 1, 1978, copyright protection lasts for the author's life plus 70 years.`,

      "contract": `## Contract Law Basics

A contract is a legally binding agreement between two or more parties that creates mutual obligations enforceable by law.

### Elements of a Valid Contract

For a contract to be legally enforceable, it must contain these essential elements:

* **Offer**: A clear proposal to do something or refrain from doing something
* **Acceptance**: Unambiguous agreement to the terms of the offer
* **Consideration**: Something of value exchanged between the parties
* **Capacity**: All parties must be legally able to enter into contracts
* **Legality**: The contract's purpose must be legal
* **Mutual assent**: All parties must understand and agree to the same terms

### Types of Contracts

Common contract types include:

* **Express contracts**: Terms are explicitly stated, either orally or in writing
* **Implied contracts**: Created by actions of the parties rather than explicit words
* **Unilateral contracts**: Only one party makes a promise
* **Bilateral contracts**: Both parties make promises to each other

### Contract Breaches

A **breach of contract** occurs when a party fails to fulfill their contractual obligations. Remedies may include:

* **Damages**: Monetary compensation for losses
* **Specific performance**: Court order requiring the breaching party to fulfill their obligations
* **Cancellation**: Canceling the contract and returning to pre-contract positions
* **Reformation**: Court-ordered change to contract terms to reflect parties' intentions

Always consult with a qualified attorney before signing any significant contract.`,

      "custody": `## Child Custody Law Overview

Child custody determinations are primarily governed by state law, but federal laws like the **Uniform Child Custody Jurisdiction and Enforcement Act** provide consistency across states.

### Types of Custody Arrangements

Courts typically recognize these custody types:

* **Legal custody**: The right to make major decisions about a child's upbringing
* **Physical custody**: Where the child primarily lives
* **Joint custody**: Rights shared between parents
* **Sole custody**: Rights granted primarily to one parent

### Best Interests of the Child Standard

Courts determine custody arrangements based on the **best interests of the child** standard, considering factors such as:

* The child's relationship with each parent
* Each parent's ability to provide a stable environment
* The child's adjustment to home, school, and community
* Each parent's physical and mental health
* Any history of domestic violence or substance abuse

### Modifying Custody Orders

Custody orders can be modified when there is a **substantial change in circumstances** affecting the child's welfare.

### Interstate Custody Issues

The **Parental Kidnapping Prevention Act** (*28 U.S. Code § 1738A*) prevents parents from seeking more favorable custody rulings by moving to different states.

For specific guidance on your situation, consult with a family law attorney licensed in your state.`,

      "default": `## Legal Information

I'm providing general information about federal law in the United States. This information constitutes general legal information rather than legal advice specific to your situation.

### Basic Legal Principles

* The U.S. legal system is based on both **statutory law** (laws passed by legislative bodies) and **common law** (court decisions that set precedents)
* Federal laws apply throughout the United States, while state laws may vary by jurisdiction
* The U.S. Constitution is the supreme law of the land

### Getting Legal Help

If you need specific legal advice for your situation:

* Consider consulting with a licensed attorney who specializes in the relevant area of law
* Many communities offer free or reduced-cost legal services through legal aid organizations
* Bar associations often provide referral services to help find appropriate legal representation

For more specific information about your legal question, please provide additional details about your situation.`
    };
    
    // Find a relevant response or use the default
    let responseText = mockResponses.default;
    
    // Check if any keywords are in the prompt
    Object.keys(mockResponses).forEach(key => {
      if (prompt.toLowerCase().includes(key.toLowerCase())) {
        responseText = mockResponses[key];
      }
    });
    
    // Add a small delay to simulate API processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(responseText)
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to process request', details: error.message })
    };
  }
};