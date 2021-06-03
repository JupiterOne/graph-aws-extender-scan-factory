interface ScanFactoryScan {
  amiId: string;
  ownerId: number;
  name: string;
  cyberVault: CyberVaultCve[];
}

interface CyberVaultCve {
  id: string;
}

interface ScanFactoryPointer {
  originAmiId: string;
  encryptedAmiId: string;
}

const scanFactoryScans: ScanFactoryScan[] = [
  {
    // CS1 Origin
    amiId: 'ami-1111111111111111',
    ownerId: 139824376857,
    name: 'hsbc-amzn2-Proxy-AL2-2021-12-26_13.27.03',
    cyberVault: [{ id: 'CVE-11111' }],
  },
  {
    // NCS1 origin
    amiId: 'ami-4444444444444444',
    ownerId: 508776121216,
    name: 'hsbc-amzn2-Proxy-AL2-2021-12-26_13.27.03',
    cyberVault: [{ id: 'CVE-11111' }],
  },
  {
    // NCS1 - ap-east-1
    amiId: 'ami-3333333333333333',
    ownerId: 508776121216,
    name: 'hsbc-amzn2-Proxy-AL2-2021-12-26_13.27.03',
    cyberVault: [{ id: 'CVE-11111' }],
  },
  {
    // NCS2 Origin
    amiId: 'ami-2222222222222222',
    ownerId: 139824376857,
    name: 'hsbc-amzn2-Proxy-AL2-2021-12-26_13.27.03',
    cyberVault: [{ id: 'CVE-11111' }],
  },
];

const scanFactoryPointers: ScanFactoryPointer[] = [
  {
    originAmiId: 'ami-1111111111111111',
    encryptedAmiId: 'ami-095d00f1ca707489f',
  },
  {
    originAmiId: 'ami-2222222222222222',
    encryptedAmiId: 'ami-040702d0bf20e67b3',
  },
  {
    originAmiId: 'ami-3333333333333333',
    encryptedAmiId: 'ami-0f30ae0b8a35df601',
  },
  {
    originAmiId: 'ami-4444444444444444',
    encryptedAmiId: 'ami-0013f08799372764e',
  },
];

export const config = {
  scanFactoryScans,
  scanFactoryPointers,
};
