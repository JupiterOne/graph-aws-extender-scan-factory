import {
  createIntegrationEntity,
  createMappedRelationship,
  IntegrationStepExecutionContext,
  RelationshipClass,
  Step,
} from '@jupiterone/integration-sdk-core';
import { config } from '../config';

const entities = {
  SCAN: {
    resourceName: 'Scan Factory Scan',
    _type: 'scan_factory_scan',
    _class: 'Assessment',
  },
};

const relationships = {
  SCAN_SCANS_AMI: {
    _type: 'scan_factory_scan_scans_aws_ami',
    sourceType: 'scan_factory_scan',
    _class: RelationshipClass.SCANS,
    targetType: 'aws_ami',
  },
  SCAN_SCANS_INSTANCE: {
    _type: 'scan_factory_scan_scans_aws_instance',
    sourceType: 'scan_factory_scan',
    _class: RelationshipClass.SCANS,
    targetType: 'aws_instance',
  },
};

async function executionHandler({
  jobState,
  logger,
}: IntegrationStepExecutionContext) {
  const { scanFactoryPointers, scanFactoryScans } = config;

  for (const scan of scanFactoryScans) {
    // Create new JuptierOne entity for the ScanFactory scan.
    logger.info(
      {
        amiId: scan.amiId,
      },
      'Creating JupiterOne entities/relationships for ScanFactory AMI',
    );
    const scanEntity = await jobState.addEntity(
      createIntegrationEntity({
        entityData: {
          source: scan,
          assign: {
            _type: entities.SCAN._type,
            _class: entities.SCAN._class,
            _key: 'scan_factory_scan:' + scan.amiId,
            name: scan.name,
            amiId: scan.amiId,
            ownerId: scan.ownerId,
            'cybervault.cves': scan.cyberVault.map((c) => c.id),

            // these properties help this entity match the JupiterOne Data Model for 'Assessment'
            // https://github.com/JupiterOne/data-model/blob/master/src/schemas/Assessment.json#L67
            category: 'Vulnerability Scan',
            summary: `Scan of AMI ${scan.amiId}`,
            internal: true,
          },
        },
      }),
    );

    // Create mapped relationship for scan -> AMI and scan -> instance
    await jobState.addRelationship(
      createMappedRelationship({
        source: scanEntity,
        _class: RelationshipClass.SCANS,
        target: {
          _type: 'aws_ami',
          _key: 'ami:' + scan.amiId,
          imageId: scan.amiId, // I have added the imageId property because it exists on the `aws_ami` entity. This will allow us to map the image.
        },
        targetFilterKeys: [['imageId', '_type']],
        skipTargetCreation: true,
      }),
    );

    await jobState.addRelationship(
      createMappedRelationship({
        source: scanEntity,
        _class: RelationshipClass.SCANS,
        target: {
          _type: 'aws_instance',
          _key: 'instance:' + scan.amiId,
          imageId: scan.amiId, // I have added the imageId property because it exists on the `aws_instance` entity. This will allow us to map the image.
        },
        targetFilterKeys: [['imageId', '_type']],
        skipTargetCreation: true,
      }),
    );

    const pointersForThisAmi = scanFactoryPointers.filter(
      (p) => p.originAmiId === scan.amiId,
    );

    for (const pointer of pointersForThisAmi) {
      const encryptedAmiId = pointer.encryptedAmiId;
      // create mapped relationship for scan -> encrypted child AMI and scan -> encrypted child instance
      await jobState.addRelationship(
        createMappedRelationship({
          source: scanEntity,
          _class: RelationshipClass.SCANS,
          target: {
            _type: 'aws_ami',
            _key: 'encrypted_ami:' + encryptedAmiId,
            imageId: encryptedAmiId, // I have added the imageId property because it exists on the `aws_ami` entity. This will allow us to map the image.
          },
          targetFilterKeys: [['imageId', '_type']],
          skipTargetCreation: true,
        }),
      );

      await jobState.addRelationship(
        createMappedRelationship({
          source: scanEntity,
          _class: RelationshipClass.SCANS,
          target: {
            _type: 'aws_instance',
            _key: 'encrypted_instance:' + encryptedAmiId,
            imageId: encryptedAmiId, // I have added the imageId property because it exists on the `aws_instance` entity. This will allow us to map the image.
          },
          targetFilterKeys: [['imageId', '_type']],
          skipTargetCreation: true,
        }),
      );
    }
  }
}

const integrationStep: Step<IntegrationStepExecutionContext> = {
  id: 'fetch-scan-factory-scans',
  name: 'Fetch Scan Factory Scans',
  entities: [entities.SCAN],
  relationships: [
    relationships.SCAN_SCANS_AMI,
    relationships.SCAN_SCANS_INSTANCE,
  ],
  executionHandler: async (context) => {
    try {
      await executionHandler(context);
    } catch (err) {
      context.logger.error(
        {
          err,
        },
        'Error exeecuting fetch-scan-factory-scans',
      );
      throw err;
    }
  },
};

export { integrationStep };
