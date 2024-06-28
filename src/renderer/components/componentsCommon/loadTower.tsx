import { getMyTowers } from 'renderer/services/HostContractService';
import { getTowers } from 'renderer/services/TowerContractService';
import { Tower } from 'renderer/utils/dataTypes';
import actions from '../../redux/actionCreators';

export default async function loadTowers() {
  try {
    const towers = await getTowers();
    let owners: string[] = [];
    if (towers) {
      owners = towers
        .filter((tower: Tower) => tower !== null)
        .map((tower: Tower) => tower.owner);
    }
    const myTowers = await getMyTowers();
    let myOwners: string[] = [];
    if (myTowers) {
      myOwners = myTowers
        .filter((tower: Tower) => tower !== null)
        .map((tower: Tower) => {
          return tower.owner;
        });
    }
    const restTowers = owners.filter((tower) => !myOwners.includes(tower));
    actions.setTowerList({ myTowers: myOwners, restTowers });
    return { myTowers: myOwners, restTowers };
  } catch (error) {
    console.error(error);
    throw new Error(`Failed to load towers: ${error}`);
  }
}
