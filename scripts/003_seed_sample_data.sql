-- Seed sample services for new shops
-- This script creates default services when a new shop is created

-- Create a function to add default services to a new shop
CREATE OR REPLACE FUNCTION public.add_default_services()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Insert default services for the new shop
  INSERT INTO public.services (shop_id, name, description, duration_minutes, price, is_active)
  VALUES
    (NEW.id, 'Classic Haircut', 'Traditional haircut with clippers and scissors', 30, 25, true),
    (NEW.id, 'Fade Cut', 'Modern fade haircut with clean edges', 45, 35, true),
    (NEW.id, 'Beard Trim', 'Professional beard shaping and trimming', 20, 15, true),
    (NEW.id, 'Hot Towel Shave', 'Luxurious straight razor shave with hot towel treatment', 45, 40, true),
    (NEW.id, 'Haircut + Beard', 'Complete grooming package', 60, 45, true),
    (NEW.id, 'Kids Haircut', 'Haircut for children under 12', 20, 18, true);

  RETURN NEW;
END;
$$;

-- Create trigger to add default services when a shop is created
DROP TRIGGER IF EXISTS on_shop_created ON public.shops;

CREATE TRIGGER on_shop_created
  AFTER INSERT ON public.shops
  FOR EACH ROW
  EXECUTE FUNCTION public.add_default_services();
