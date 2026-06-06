import { supabase } from '../lib/supabase';
import { Lead, Task } from '../types'; // Adjust types as needed

export const api = {
  // Fetch multiple leads
  async getLeads() {
    const { data, error } = await supabase
      .from('leads')
      .select('*');
      
    if (error) {
      console.error('Error fetching leads:', error);
      return [];
    }
    return data;
  },

  // Fetch tasks
  async getTasks() {
    const { data, error } = await supabase
      .from('tasks')
      .select('*');
      
    if (error) {
      console.error('Error fetching tasks:', error);
      return [];
    }
    return data;
  }
};