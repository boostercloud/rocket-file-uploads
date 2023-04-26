import { ApplicationSynthStack, RocketUtils } from '@boostercloud/framework-provider-azure-infrastructure'
import { roleAssignment, windowsFunctionApp } from '@cdktf/provider-azurerm'
import { AzurermProvider } from '@cdktf/provider-azurerm/lib/provider'
import { TerraformStack } from 'cdktf'

export class TerraformRoleAssignment {
  static build(
    providerResource: AzurermProvider,
    terraformStack: TerraformStack,
    applicationSynthStack: ApplicationSynthStack,
    utils: RocketUtils,
    rocketStorageAccountId: string,
    functionAppResource: windowsFunctionApp.WindowsFunctionApp
  ): Array<roleAssignment.RoleAssignment> {
    if (!functionAppResource.identity.identityIds || functionAppResource.identity.identityIds.length === 0) {
      throw new Error('FunctionApp identity not found')
    }
    const firstIdentity = '${' + functionAppResource.fqn + '.identity.0.principal_id}'
    let id = utils.toTerraformName(rocketStorageAccountId + functionAppResource.name, 'rfrlb')
    const blobContributorRole = new roleAssignment.RoleAssignment(terraformStack, id, {
      scope: rocketStorageAccountId,
      roleDefinitionName: 'Storage Blob Data Contributor',
      principalId: firstIdentity,
      provider: providerResource,
    })

    id = utils.toTerraformName(rocketStorageAccountId + functionAppResource.name, 'rfrlr')
    const readerAndDataRole = new roleAssignment.RoleAssignment(terraformStack, id, {
      scope: rocketStorageAccountId,
      roleDefinitionName: 'Reader and Data Access',
      principalId: firstIdentity,
      provider: providerResource,
    })

    return [blobContributorRole, readerAndDataRole]
  }
}
