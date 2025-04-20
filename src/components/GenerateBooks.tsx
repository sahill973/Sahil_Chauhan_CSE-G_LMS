
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

const GenerateBooks = () => {
  const [loading, setLoading] = useState(false);

  const handleGenerateBooks = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-sample-books', {
        method: 'POST',
        body: {}
      });

      if (error) throw error;

      if (data.existing) {
        toast.info('Sample books are already in the database!');
      } else {
        toast.success('Successfully generated sample books for all departments!');
      }
    } catch (error) {
      console.error('Error generating books:', error);
      toast.error(`Failed to generate sample books: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button 
      onClick={handleGenerateBooks} 
      disabled={loading}
      variant="secondary"
    >
      {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
      Generate Sample Books
    </Button>
  );
};

export default GenerateBooks;
