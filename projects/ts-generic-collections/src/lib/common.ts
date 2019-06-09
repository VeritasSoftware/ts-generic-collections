import { IEnumerable, IGroup } from './interfaces';
import { List } from './list';

export class Group<T> implements IGroup<T> {
    groups: any[];
    list: IEnumerable<T> = new List<T>();

    constructor(groups: any[], list: Array<T>) {
        this.groups = groups;
        this.list = new List<T>(list);
    }
}

export var objCompare = function (obj1, obj2) {
	//Loop through properties in object 1
	for (var p in obj1) {
		//Check property exists on both objects
		if (obj1.hasOwnProperty(p) !== obj2.hasOwnProperty(p)) return false;
 
		switch (typeof (obj1[p])) {
			//Deep compare objects
			case 'object':
				if (!objCompare(obj1[p], obj2[p])) return false;
				break;
			//Compare function code
			case 'function':
				if (typeof (obj2[p]) == 'undefined' || (p != 'compare' && obj1[p].toString() != obj2[p].toString())) return false;
				break;
			//Compare values
			default:
				if (obj1[p] != obj2[p]) return false;
		}
	}
 
	//Check object 2 for any extra properties
	for (var p in obj2) {
		if (typeof (obj1[p]) == 'undefined') return false;
	}
	return true;
};

export const ITEM_NOT_FOUND_MSG: string = "Item does not exist.";
export const MULTIPLE_INSTANCES_FOUND_MSG: string = "Multiple instances of entity found.";