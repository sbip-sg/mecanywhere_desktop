export function createVerifiableCredential(did) {
    const credential = {
      '@context': ['https://www.w3.org/2018/credentials/v1'],
      type: ['VerifiableCredential'],
      issuer: did,
      issuanceDate: new Date().toISOString(),
      credentialSubject: {
        id: did,
        name: 'Alice Smith',
        degree: {
          type: 'BachelorDegree',
          name: 'Bachelor of Science in Computer Science',
          institution: 'Example University'
        }
      }
    };
  
    return credential;
  }