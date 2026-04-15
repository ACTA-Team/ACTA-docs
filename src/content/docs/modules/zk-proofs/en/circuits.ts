import type { DocPage } from "@/@types/docs";

export const circuits: DocPage = {
  slug: "zk-circuits",
  title: "Circuits",
  section: "Zero-Knowledge Proofs",
  tocItems: [
    "Age ≥ 18 (isAdult)",
    "Not Expired (notExpired)",
    "Status is Valid (isValid)",
    "Circuit Structure",
    "ACIR Artifacts",
  ],
  content: `
# ZK Circuits

ACTA uses Noir circuits to define ZK proof predicates. Each circuit is compiled to ACIR (Abstract Circuit Intermediate Representation) and used for proof generation and verification.

## Age ≥ 18 (isAdult)

Proves that a person is at least 18 years old without revealing their exact age.

### Circuit Code

\`\`\`rust
fn main(age: u8) {
    assert(age > 18);
}
\`\`\`

### Inputs

- **Private Input**: \`age: u8\` - The person's age (not revealed)

### Output

- **Public Output**: \`bool\` → \`true\` if \`age >= 18\`, otherwise the circuit fails

### How It Works

1. Extract birth date from credential
2. Calculate age from birth date to current date
3. Pass age to circuit as private input
4. Circuit asserts \`age > 18\`
5. Generate proof without revealing the actual age value

### Use Cases

- Age verification for age-restricted services
- Compliance with legal age requirements
- Privacy-preserving age checks

### ACIR Artifact

\`\`\`
noir_workshop.json
\`\`\`

## Not Expired (notExpired)

Proves that a credential has not expired without revealing the expiration date.

### Circuit Code

\`\`\`rust
fn main(expiry_ts: u64, now_ts: u64) {
    assert(expiry_ts > now_ts);
}
\`\`\`

### Inputs

- **Private Inputs**: 
  - \`expiry_ts: u64\` - Expiration timestamp in milliseconds (not revealed)
  - \`now_ts: u64\` - Current timestamp in milliseconds (computed off-chain)

### Output

- **Public Output**: \`bool\` → \`true\` if \`expiry_ts > now_ts\`, otherwise the circuit fails

### How It Works

1. Extract expiration date from credential
2. Get current timestamp (computed off-chain)
3. Pass both timestamps to circuit as private inputs
4. Circuit asserts \`expiry_ts > now_ts\`
5. Generate proof without revealing the actual expiration date

### Use Cases

- Verify credential is still valid
- Check if credential hasn't expired
- Time-based access control

### ACIR Artifact

\`\`\`
noir_not_expired.json
\`\`\`

## Status is Valid (isValid)

Proves that a credential has a valid status without revealing other status details.

### Circuit Code

\`\`\`rust
fn main(valid: Field) {
    assert(valid == 1);
}
\`\`\`

### Inputs

- **Private Input**: \`valid: Field\` - Status flag (1 for valid, 0 for invalid)

### Output

- **Public Output**: \`bool\` → \`true\` if \`valid == 1\`, otherwise the circuit fails

### How It Works

1. Extract status from credential
2. Convert status to flag: \`status === 'valid' ? 1 : 0\`
3. Pass flag to circuit as private input
4. Circuit asserts \`valid == 1\`
5. Generate proof without revealing other status information

### Use Cases

- Verify credential is not revoked
- Check credential state
- Status-based authorization

### ACIR Artifact

\`\`\`
noir_valid_status.json
\`\`\`

## Circuit Structure

All circuits follow a similar structure:

1. **Input Definition** - Private inputs that won't be revealed
2. **Assertion Logic** - The condition to prove
3. **Compilation** - Compiled to ACIR JSON format
4. **Deployment** - ACIR files served from \`public/zk/\` directory

### Compilation

Circuits are compiled using \`nargo\`:

\`\`\`bash
nargo compile
\`\`\`

This generates the ACIR JSON file in \`target/\` directory.

## ACIR Artifacts

ACIR (Abstract Circuit Intermediate Representation) files are the compiled circuits:

- \`noir_workshop.json\` - Age ≥ 18 circuit
- \`noir_not_expired.json\` - Not expired circuit
- \`noir_valid_status.json\` - Status is valid circuit

These files are:
- Loaded by the dApp from \`public/zk/\` directory
- Used for proof generation in the browser
- Referenced by the on-chain verifier contract

### Publishing Circuits

To publish a circuit for use in the dApp:

1. Compile the circuit: \`nargo compile\`
2. Copy ACIR JSON to \`dApp-ACTA/public/zk/\`
3. The dApp will load it automatically

See the [zk-test repository](https://github.com/ACTA-Team/zk-test) for circuit source code and compilation instructions.
    `,
};
