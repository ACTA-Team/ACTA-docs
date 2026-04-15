import type { DocPage } from "@/@types/docs";

export const generation: DocPage = {
  slug: "zk-generation",
  title: "Proof Generation",
  section: "Zero-Knowledge Proofs",
  tocItems: [
    "Overview",
    "Generation Process",
    "Input Preparation",
    "Circuit Execution",
    "Proof Artifacts",
    "Integration in dApp",
  ],
  content: `
# ZK Proof Generation

ZK proofs in ACTA are generated client-side in the browser using Noir circuits and bb.js backend.

## Overview

Proof generation happens entirely in the user's browser:
- No data is sent to servers during generation
- Private inputs remain private
- Proofs are generated using cryptographic libraries

### Technologies

- **Noir** - Circuit language and JavaScript bindings (\`@noir-lang/noir_js\`)
- **bb.js** - Barretenberg backend (\`@aztec/bb.js\`) for proof generation
- **ACIR** - Compiled circuit representation loaded from JSON files

## Generation Process

### Step 1: Select Fields and Predicate

When sharing a credential in the dApp:

1. **Select Fields to Reveal**
   - Choose which credential fields should be visible
   - Other fields remain private

2. **Choose ZK Predicate**
   - Select from available predicates:
     - \`isAdult\` - Age ≥ 18
     - \`notExpired\` - Credential not expired
     - \`isValid\` - Status is valid

### Step 2: Input Preparation

The dApp extracts and prepares inputs based on the selected predicate:

#### For \`isAdult\`:

\`\`\`typescript
// Extract birth date from credential
const dob = credential.birthDate;
const ageYears = calculateAge(dob);

// Input: { age: ageYears }
\`\`\`

#### For \`notExpired\`:

\`\`\`typescript
// Extract expiration and current timestamp
const expiry_ts = Date.parse(credential.expirationDate);
const now_ts = Date.now();

// Input: { expiry_ts, now_ts }
\`\`\`

#### For \`isValid\`:

\`\`\`typescript
// Convert status to flag
const valid = credential.status === 'valid' ? '1' : '0';

// Input: { valid }
\`\`\`

### Step 3: Circuit Execution

1. **Load ACIR** - Fetch the circuit JSON from \`public/zk/\`
2. **Initialize Noir** - Create Noir instance with ACIR
3. **Initialize Backend** - Create bb.js backend
4. **Execute Circuit** - Run circuit with private inputs
5. **Generate Witness** - Create witness from execution result

\`\`\`typescript
const { Noir } = await import('@noir-lang/noir_js');
const { UltraHonkBackend } = await import('@aztec/bb.js');

// Load ACIR
const acir = await fetch('/zk/noir_workshop.json').then(r => r.json());

// Initialize
const noir = new Noir(acir);
const backend = new UltraHonkBackend(acir.bytecode);

// Execute
const execRes = await noir.execute({ age: ageYears });

// Generate proof
const proofData = await backend.generateProof(execRes.witness);
\`\`\`

### Step 4: Proof Artifacts

The generation produces:

- **Proof** - The cryptographic proof (base64 encoded)
- **Public Inputs** - Public signals that are part of the proof
- **Statement** - Metadata about the predicate and revealed fields

\`\`\`typescript
{
  proof: string,           // Base64 encoded proof
  publicInputs: string[],  // Public signals
  statement: {
    kind: 'isAdult' | 'notExpired' | 'isValid',
    selectedKeys: string[],
    // ... predicate-specific parameters
  }
}
\`\`\`

## Proof Artifacts

### Proof Structure

The proof is a JSON object containing:

\`\`\`json
{
  "publicInputs": ["..."],
  "proof": "base64_encoded_proof_bytes"
}
\`\`\`

### Public Inputs

Public inputs are values that are part of the proof but don't reveal private data:
- For \`isAdult\`: Empty (age is private)
- For \`notExpired\`: Empty (timestamps are private)
- For \`isValid\`: Empty (status flag is private)

### Statement Metadata

The statement contains:
- \`kind\` - Predicate type
- \`selectedKeys\` - Fields that were revealed
- Predicate-specific parameters (for reference, not part of proof)

## Integration in dApp

The proof generation is integrated in the dApp's share flow:

1. User selects credential to share
2. Chooses fields to reveal
3. Selects ZK predicate
4. Clicks **Generate ZK Proof**
5. Proof is generated client-side
6. Share link is created with proof included

### Code Location

- **Generation logic (\`zk.ts\`)**: [View on GitHub](https://github.com/ACTA-Team/dApp-ACTA/blob/develop/src/lib/zk.ts)
- **Integration (\`useShareCredential.ts\`)**: [View on GitHub](https://github.com/ACTA-Team/dApp-ACTA/blob/develop/src/components/modules/credentials/hooks/useShareCredential.ts)

### Security Notes

- All generation happens client-side
- Private inputs never leave the browser
- Proofs are cryptographically secure
- No server-side processing required
    `,
};
