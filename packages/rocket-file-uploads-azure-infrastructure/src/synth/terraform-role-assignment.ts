import { ApplicationSynthStack, RocketUtils } from '@boostercloud/framework-provider-azure-infrastructure'
import { FunctionApp, RoleAssignment } from '@cdktf/provider-azurerm'
import { TerraformStack } from 'cdktf'

export class TerraformRoleAssignment {
  static build(
    terraformStack: TerraformStack,
    applicationSynthStack: ApplicationSynthStack,
    utils: RocketUtils,
    rocketStorageAccountId: string,
    functionApp: FunctionApp
  ): Array<RoleAssignment> {
    if (!functionApp.identity.identityIds || functionApp.identity.identityIds.length === 0) {
      throw new Error('FunctionApp identity not found')
    }
    const firstIdentity = '${' + functionApp.fqn + '.identity.0.principal_id}'
    let id = utils.toTerraformName(rocketStorageAccountId + functionApp.name, 'rfrlb')
    const blobContributorRole = new RoleAssignment(terraformStack, id, {
      scope: rocketStorageAccountId,
      roleDefinitionName: 'Storage Blob Data Contributor',
      principalId: firstIdentity,
    })

    id = utils.toTerraformName(rocketStorageAccountId + functionApp.name, 'rfrlr')
    const readerAndDataRole = new RoleAssignment(terraformStack, id, {
      scope: rocketStorageAccountId,
      roleDefinitionName: 'Reader and Data Access',
      principalId: firstIdentity,
    })

    return [blobContributorRole, readerAndDataRole]
  }
}
