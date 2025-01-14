import { Injectable } from '@angular/core';
import { RuleLogic } from 'src/app/models/business-rules/rule-logic.model';
// import { RuleLogicEnum } from 'src/app/enums/rule-logic.enum';

@Injectable({
  providedIn: 'root'
})
export class RulesLogicService {
  isLogicValid(logic: RuleLogic, businessEntityList: Map<string, string>) {
    let entities = [];
    let ruleLogic = false;
    const entityName = businessEntityList.get(logic.businessEntityName);
    if (entityName) {
      entities = entityName.toString().split('\n');
    } else {
      // return true if the logic is negative
      return ['IS NOT', 'NOT CONTAINS', 'NOT IN'].indexOf(logic.relationalOperatorName) >= 0;
    }
    let isNegative = false;
    for (let entity of entities) {
      if (!entity) {
        entity = '';
      } else {
        entity = entity.toUpperCase();
      }
      const logicValue = logic.logicItemValue.toUpperCase();
      switch (logic.relationalOperatorName) {
        case 'IS':
          ruleLogic = entity === logicValue;
          break;
        case 'CONTAINS':
          ruleLogic = entity.indexOf(logicValue) >= 0;
          break;
        case 'NOT CONTAINS':
          ruleLogic = entity.indexOf(logicValue) >= 0;
          isNegative = true;
          break;
        case 'IS NOT':
          ruleLogic = entity === logicValue;
          isNegative = true;
          break;
        case 'NOT IN':
          ruleLogic = logicValue.split('|').indexOf(entity) > -1;
          isNegative = true;
          break;
        case 'IN':
          ruleLogic = logicValue.split('|').indexOf(entity) >= 0;
          break;
        case '>=':
          ruleLogic = Number(logicValue) >= Number(entity);
          break;
        case '<=':
          ruleLogic = Number(entity) <= Number(logicValue);
          break;
        case 'NOT BETWEEN':
          const rulelogic = logicValue.split('|');
          if (rulelogic && rulelogic.length > 1) {
            ruleLogic = !(rulelogic[0] <= entity && entity <= rulelogic[1]);
          }
          break;
        default:
          ruleLogic = false;
      }

      if (isNegative && ruleLogic) {
        return false;
      } else if (ruleLogic) {
        return ruleLogic;
      }
    }
    return isNegative ? !ruleLogic : ruleLogic;
  }

  isRuleLogicValid(ruleLogics: RuleLogic[], businessEntityList: Map<string, string>) {
    for (const rule of ruleLogics) {
      const valid = this.isLogicValid(rule, businessEntityList);
      if (!valid) {
        return false;
      }
    }
    return true;
  }
}
