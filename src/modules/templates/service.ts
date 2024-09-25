import * as schema from '@/modules/templates/schema';
import TemplateModel from '@/modules/templates/model';
import { Templates } from '@/database';
import NotFound from '@/utils/errors/NotFound';

export default class TemplateService extends TemplateModel {
  async fetchTemplate(templateId: number) {
    let result: Templates | undefined;

    if (templateId) {
      const identifier = schema.parseId(templateId);
      result = await this.select(identifier);
    } else {
      result = await this.selectRand();
    }

    if (!result) {
      throw new NotFound(`Template by id of ${templateId} not found.`);
    }

    return result;
  }
}
