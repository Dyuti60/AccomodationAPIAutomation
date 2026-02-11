import Log from '../../../src/utils/logger';
import { pgPoolData } from '../pg.client';

export class SatsangSSO {

    static async getSSOMemberIdList(){
        const query=`
        select y.sfmm_id, y.dp_mem_contact_no, 
        concat(sdpi.sdpi_sfmm_first_name,' ', sdpi.sdpi_sfmm_middle_name, ' ', sdpi.sdpi_sfmm_last_name ) as dp_mem_full_name from (
        SELECT sdco_sfmm_id as sfmm_id, contact_no as dp_mem_contact_no
        FROM (
            SELECT sdci.sdco_sfmm_id, sdci.sdco_acco_contact AS contact_no FROM satsang_data_mgmt.satsang_devotee_contact_info sdci
            UNION 
            SELECT sdci.sdco_sfmm_id, sdci.sdco_online_phil_contact FROM satsang_data_mgmt.satsang_devotee_contact_info sdci
            UNION 
            SELECT sdci.sdco_sfmm_id, sdci.sdco_org_contact FROM satsang_data_mgmt.satsang_devotee_contact_info sdci
            UNION 
            SELECT sdci.sdco_sfmm_id, sdci.sdco_dp_contact FROM satsang_data_mgmt.satsang_devotee_contact_info sdci
            UNION 
            SELECT sdci.sdco_sfmm_id, sdci.sdco_primary_contact FROM satsang_data_mgmt.satsang_devotee_contact_info sdci
        ) x
        WHERE x.contact_no IS NOT NULL
        AND TRIM(x.contact_no ) <> ''
        GROUP BY sdco_sfmm_id,contact_no
        ) y
        inner join satsang_data_mgmt.satsang_devotee_profile_info sdpi 
        on y.sfmm_id = sdpi.sdpi_sfmm_id
        order by Random()
        limit 1
        `
    const result = await pgPoolData.query(query)
    const memberUUID = result.rows[0].sfmm_id
    return memberUUID
    }    

    static async getSSOMemberIdsByContactNumber(contactNumber:string){
        const query=`
        select y.sfmm_id, y.dp_mem_contact_no, 
        concat(sdpi.sdpi_sfmm_first_name,' ', sdpi.sdpi_sfmm_middle_name, ' ', sdpi.sdpi_sfmm_last_name ) as dp_mem_full_name from (
        SELECT sdco_sfmm_id as sfmm_id, contact_no as dp_mem_contact_no
        FROM (
            SELECT sdci.sdco_sfmm_id, sdci.sdco_acco_contact AS contact_no FROM satsang_data_mgmt.satsang_devotee_contact_info sdci
            UNION 
            SELECT sdci.sdco_sfmm_id, sdci.sdco_online_phil_contact FROM satsang_data_mgmt.satsang_devotee_contact_info sdci
            UNION 
            SELECT sdci.sdco_sfmm_id, sdci.sdco_org_contact FROM satsang_data_mgmt.satsang_devotee_contact_info sdci
            UNION 
            SELECT sdci.sdco_sfmm_id, sdci.sdco_dp_contact FROM satsang_data_mgmt.satsang_devotee_contact_info sdci
            UNION 
            SELECT sdci.sdco_sfmm_id, sdci.sdco_primary_contact FROM satsang_data_mgmt.satsang_devotee_contact_info sdci
        ) x
        WHERE x.contact_no IS NOT NULL
        AND TRIM(x.contact_no ) <> ''
        GROUP BY sdco_sfmm_id,contact_no
        ) y
        inner join satsang_data_mgmt.satsang_devotee_profile_info sdpi 
        on y.sfmm_id = sdpi.sdpi_sfmm_id
        where y.dp_mem_contact_no=$1
        `
    const result = await pgPoolData.query(query,[contactNumber])
    const count = result.rowCount
    let memberUUIDs:string[] =[]
    if (count != null){
        for (let i=0; i<count;i++){
            memberUUIDs.push(result.rows[i]?.sfmm_id)
        }
    }
    return memberUUIDs
    }

    static async getRandomSSOMemberDetails(){
        const query=`
        select y.sfmm_id, y.dp_mem_contact_no, 
        concat(sdpi.sdpi_sfmm_first_name,' ', sdpi.sdpi_sfmm_middle_name, ' ', sdpi.sdpi_sfmm_last_name ) as dp_mem_full_name from (
        SELECT sdco_sfmm_id as sfmm_id, contact_no as dp_mem_contact_no
        FROM (
            SELECT sdci.sdco_sfmm_id, sdci.sdco_acco_contact AS contact_no FROM satsang_data_mgmt.satsang_devotee_contact_info sdci
            UNION 
            SELECT sdci.sdco_sfmm_id, sdci.sdco_online_phil_contact FROM satsang_data_mgmt.satsang_devotee_contact_info sdci
            UNION 
            SELECT sdci.sdco_sfmm_id, sdci.sdco_org_contact FROM satsang_data_mgmt.satsang_devotee_contact_info sdci
            UNION 
            SELECT sdci.sdco_sfmm_id, sdci.sdco_dp_contact FROM satsang_data_mgmt.satsang_devotee_contact_info sdci
            UNION 
            SELECT sdci.sdco_sfmm_id, sdci.sdco_primary_contact FROM satsang_data_mgmt.satsang_devotee_contact_info sdci
        ) x
        WHERE x.contact_no IS NOT NULL
        AND TRIM(x.contact_no ) <> ''
        GROUP BY sdco_sfmm_id,contact_no
        ) y
        inner join satsang_data_mgmt.satsang_devotee_profile_info sdpi 
        on y.sfmm_id = sdpi.sdpi_sfmm_id
        order by Random()
        limit 1;
        `
        const result = await pgPoolData.query(query)
        const memberDetails = result.rows[0]
        return memberDetails
    }


    static async getRandomSSORegisteredMemberContact(){
        const query=`
    select y.sfmm_id, y.contact_no, sdci2.sdco_member_code  as member_code, sdci2.sdco_family_code family_code,
    concat(sdpi.sdpi_sfmm_first_name,' ', sdpi.sdpi_sfmm_middle_name, ' ', sdpi.sdpi_sfmm_last_name ) as dp_mem_full_name from (
    SELECT sdco_sfmm_id as sfmm_id, contact_no as contact_no
    FROM (
        SELECT sdci.sdco_sfmm_id, sdci.sdco_acco_contact AS contact_no, sdci.sdco_member_code, sdci.sdco_family_code   FROM satsang_data_mgmt.satsang_devotee_contact_info sdci
        UNION 
        SELECT sdci.sdco_sfmm_id, sdci.sdco_online_phil_contact, sdci.sdco_member_code, sdci.sdco_family_code  FROM satsang_data_mgmt.satsang_devotee_contact_info sdci
        UNION 
        SELECT sdci.sdco_sfmm_id, sdci.sdco_org_contact, sdci.sdco_member_code, sdci.sdco_family_code  FROM satsang_data_mgmt.satsang_devotee_contact_info sdci
        UNION 
        SELECT sdci.sdco_sfmm_id, sdci.sdco_dp_contact, sdci.sdco_member_code, sdci.sdco_family_code  FROM satsang_data_mgmt.satsang_devotee_contact_info sdci
        UNION 
        SELECT sdci.sdco_sfmm_id, sdci.sdco_primary_contact, sdci.sdco_member_code, sdci.sdco_family_code  FROM satsang_data_mgmt.satsang_devotee_contact_info sdci
    ) x
    WHERE x.contact_no IS NOT NULL
    AND TRIM(x.contact_no ) <> ''
    GROUP BY sdco_sfmm_id,contact_no
    ) y
    inner join satsang_data_mgmt.satsang_devotee_profile_info sdpi 
    on y.sfmm_id = sdpi.sdpi_sfmm_id
    inner join satsang_data_mgmt.satsang_devotee_contact_info sdci2
    on y.sfmm_id = sdci2.sdco_sfmm_id 
    where sdpi.sdpi_sfmm_aadhar is not null
    order by Random()
    limit 1;
        `
        const result = await pgPoolData.query(query)
        const contactNumber = result.rows[0]?.contact_no
        return contactNumber
    }

    static async getRandomSSOUnRegisteredMemberContact(){
        const query=`
    select y.sfmm_id, y.contact_no, sdci2.sdco_member_code  as member_code, sdci2.sdco_family_code family_code,
    concat(sdpi.sdpi_sfmm_first_name,' ', sdpi.sdpi_sfmm_middle_name, ' ', sdpi.sdpi_sfmm_last_name ) as dp_mem_full_name from (
    SELECT sdco_sfmm_id as sfmm_id, contact_no as contact_no
    FROM (
        SELECT sdci.sdco_sfmm_id, sdci.sdco_acco_contact AS contact_no, sdci.sdco_member_code, sdci.sdco_family_code   FROM satsang_data_mgmt.satsang_devotee_contact_info sdci
        UNION 
        SELECT sdci.sdco_sfmm_id, sdci.sdco_online_phil_contact, sdci.sdco_member_code, sdci.sdco_family_code  FROM satsang_data_mgmt.satsang_devotee_contact_info sdci
        UNION 
        SELECT sdci.sdco_sfmm_id, sdci.sdco_org_contact, sdci.sdco_member_code, sdci.sdco_family_code  FROM satsang_data_mgmt.satsang_devotee_contact_info sdci
        UNION 
        SELECT sdci.sdco_sfmm_id, sdci.sdco_dp_contact, sdci.sdco_member_code, sdci.sdco_family_code  FROM satsang_data_mgmt.satsang_devotee_contact_info sdci
        UNION 
        SELECT sdci.sdco_sfmm_id, sdci.sdco_primary_contact, sdci.sdco_member_code, sdci.sdco_family_code  FROM satsang_data_mgmt.satsang_devotee_contact_info sdci
    ) x
    WHERE x.contact_no IS NOT NULL
    AND TRIM(x.contact_no ) <> ''
    GROUP BY sdco_sfmm_id,contact_no
    ) y
    inner join satsang_data_mgmt.satsang_devotee_profile_info sdpi 
    on y.sfmm_id = sdpi.sdpi_sfmm_id
    inner join satsang_data_mgmt.satsang_devotee_contact_info sdci2
    on y.sfmm_id = sdci2.sdco_sfmm_id 
    where sdpi.sdpi_sfmm_aadhar is null
    order by Random()
    limit 1;
        `
        const result = await pgPoolData.query(query)
        const contactNumber = result.rows[0]?.dp_mem_contact_no
        return contactNumber
    }

    static async getRandomSSOContactNumbersByMemberId(memberId:string){
        const query=`
        select y.sfmm_id, y.dp_mem_contact_no, 
        concat(sdpi.sdpi_sfmm_first_name,' ', sdpi.sdpi_sfmm_middle_name, ' ', sdpi.sdpi_sfmm_last_name ) as dp_mem_full_name from (
        SELECT sdco_sfmm_id as sfmm_id, contact_no as dp_mem_contact_no
        FROM (
            SELECT sdci.sdco_sfmm_id, sdci.sdco_acco_contact AS contact_no FROM satsang_data_mgmt.satsang_devotee_contact_info sdci
            UNION 
            SELECT sdci.sdco_sfmm_id, sdci.sdco_online_phil_contact FROM satsang_data_mgmt.satsang_devotee_contact_info sdci
            UNION 
            SELECT sdci.sdco_sfmm_id, sdci.sdco_org_contact FROM satsang_data_mgmt.satsang_devotee_contact_info sdci
            UNION 
            SELECT sdci.sdco_sfmm_id, sdci.sdco_dp_contact FROM satsang_data_mgmt.satsang_devotee_contact_info sdci
            UNION 
            SELECT sdci.sdco_sfmm_id, sdci.sdco_primary_contact FROM satsang_data_mgmt.satsang_devotee_contact_info sdci
        ) x
        WHERE x.contact_no IS NOT NULL
        AND TRIM(x.contact_no ) <> ''
        GROUP BY sdco_sfmm_id,contact_no
        ) y
        inner join satsang_data_mgmt.satsang_devotee_profile_info sdpi 
        on y.sfmm_id = sdpi.sdpi_sfmm_id
        where y.sfmm_id=$1
        `
    const result = await pgPoolData.query(query,[memberId])
    const count = result.rowCount
    let memberContactNumbers:string[] =[]
    if (count != null){
        for (let i=0; i<count;i++){
            memberContactNumbers.push(result.rows[i]?.dp_mem_contact_no)
        }
    }
    Log.info(`Member Contact Numbers - getRandomSSOContactNumbersByMemberId: ${memberContactNumbers.toString()}`)
    return memberContactNumbers
    }

}
