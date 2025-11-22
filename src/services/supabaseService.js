/**
 * Supabase Service
 * Handles all database operations with Supabase
 */

import { supabase } from '../config/supabaseConfig';

/**
 * Get member profile by user ID
 * @param {string} userId - Supabase auth user ID
 * @returns {Promise<Object>} Member profile or null
 */
export const getMemberProfile = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('members')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching member profile:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in getMemberProfile:', error);
    return null;
  }
};

/**
 * Create member profile after signup
 * @param {Object} memberData - Member data
 * @returns {Promise<Object>} Created member profile or error
 */
export const createMemberProfile = async (memberData) => {
  try {
    console.log('📝 Creating/updating member profile in Supabase...', {
      userId: memberData.id,
      name: memberData.name,
      membershipType: memberData.membershipType,
    });

    // Use upsert to handle case where trigger already created the profile
    const { data, error } = await supabase
      .from('members')
      .upsert(
        {
          id: memberData.id,
          name: memberData.name,
          phone: memberData.phone || null,
          address: memberData.address || null,
          membership_type: memberData.membershipType,
        },
        {
          onConflict: 'id',
        }
      )
      .select()
      .single();

    if (error) {
      console.error('❌ Error creating/updating member profile:', error);
      return { success: false, error: error.message };
    }

    console.log('✅ Member profile created/updated successfully in Supabase:', data);
    return { success: true, data };
  } catch (error) {
    console.error('❌ Error in createMemberProfile:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Update member profile
 * @param {string} userId - User ID
 * @param {Object} updates - Fields to update
 * @returns {Promise<Object>} Updated member profile or error
 */
export const updateMemberProfile = async (userId, updates) => {
  try {
    const { data, error } = await supabase
      .from('members')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error updating member profile:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error in updateMemberProfile:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Create adoption application
 * @param {Object} applicationData - Adoption application data
 * @returns {Promise<Object>} Created application or error
 */
export const createAdoptionApplication = async (applicationData) => {
  try {
    console.log('📝 Submitting adoption application to Supabase...', {
      memberId: applicationData.memberId,
      petId: applicationData.petId,
      petName: applicationData.petName,
      memberEmail: applicationData.memberEmail,
    });

    const { data, error } = await supabase
      .from('adoption_applications')
      .insert([
        {
          member_id: applicationData.memberId || null,
          pet_id: applicationData.petId,
          pet_name: applicationData.petName,
          pet_breed: applicationData.petBreed,
          pet_type: applicationData.petType,
          member_name: applicationData.memberName,
          member_email: applicationData.memberEmail,
          member_phone: applicationData.memberPhone,
          member_address: applicationData.memberAddress,
          reason: applicationData.reason,
          home_environment: applicationData.homeEnvironment,
          experience: applicationData.experience,
          other_pets: applicationData.otherPets || null,
          additional_info: applicationData.additionalInfo || null,
          status: 'pending',
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('❌ Error creating adoption application:', error);
      return { success: false, error: error.message };
    }

    console.log('✅ Adoption application created successfully in Supabase:', {
      id: data.id,
      petName: data.pet_name,
      memberEmail: data.member_email,
      status: data.status,
      createdAt: data.created_at,
    });
    return { success: true, data };
  } catch (error) {
    console.error('❌ Error in createAdoptionApplication:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Create pet surrender request
 * @param {Object} surrenderData - Pet surrender request data
 * @returns {Promise<Object>} Created request or error
 */
export const createSurrenderRequest = async (surrenderData) => {
  try {
    console.log('📝 Submitting surrender request to Supabase...', {
      ownerName: surrenderData.ownerName,
      ownerEmail: surrenderData.ownerEmail,
      petName: surrenderData.petName,
      petType: surrenderData.petType,
    });

    const { data, error } = await supabase
      .from('pet_surrender_requests')
      .insert([
        {
          owner_name: surrenderData.ownerName,
          owner_email: surrenderData.ownerEmail,
          owner_phone: surrenderData.ownerPhone,
          owner_address: surrenderData.ownerAddress,
          pet_name: surrenderData.petName,
          pet_type: surrenderData.petType,
          pet_breed: surrenderData.petBreed,
          pet_age: surrenderData.petAge,
          pet_gender: surrenderData.petGender,
          reason: surrenderData.reason,
          medical_history: surrenderData.medicalHistory || null,
          additional_info: surrenderData.additionalInfo || null,
          status: 'pending',
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('❌ Error creating surrender request:', error);
      return { success: false, error: error.message };
    }

    console.log('✅ Surrender request created successfully in Supabase:', {
      id: data.id,
      petName: data.pet_name,
      ownerEmail: data.owner_email,
      status: data.status,
      createdAt: data.created_at,
    });
    return { success: true, data };
  } catch (error) {
    console.error('❌ Error in createSurrenderRequest:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Get adoption applications for a member
 * @param {string} memberId - Member ID
 * @returns {Promise<Array>} List of applications
 */
export const getMemberAdoptionApplications = async (memberId) => {
  try {
    const { data, error } = await supabase
      .from('adoption_applications')
      .select('*')
      .eq('member_id', memberId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching adoption applications:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getMemberAdoptionApplications:', error);
    return [];
  }
};

