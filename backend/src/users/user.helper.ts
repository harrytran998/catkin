import { GroupsService } from '../group/groups.service';

export function GetUserGroups(user: any): string[] {
  var groups: string[] = [];
  user['https://catkin.dev/permissions'].forEach(element => {
    groups.push(element.group);
  });
  // groupsService: GroupsService;
  // this.groupsService.findAll(groups);

  return groups;
}

export function GetWritableUserGroups(user: any): string[] {
  var groups: string[] = [];
  user['https://catkin.dev/permissions'].forEach(element => {
    if (element.role === 'admin' || element.role === 'member') {
      groups.push(element.group);
    }
  });
  return groups;
}

export function GetAdminUserGroups(user: any): string[] {
  var groups: string[] = [];
  user['https://catkin.dev/permissions'].forEach(element => {
    if (element.role === 'admin') {
      groups.push(element.group);
    }
  });
  return groups;
}
