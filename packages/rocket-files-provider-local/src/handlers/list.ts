import { BoosterConfig } from '@boostercloud/framework-types'
import { ListItem } from '@boostercloud/rocket-files-types'

export async function list(config: BoosterConfig, directory: string): Promise<Array<ListItem>> {
  return [
    {
      name: 'local file',
      properties: {
        lastModified: new Date(),
      },
    },
  ] as Array<ListItem>
}
