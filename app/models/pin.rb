class Pin < ApplicationRecord
    
    # validates :title, presence: true 
    validate :ensure_image
    has_one_attached :image
    
    has_many :board_to_pin_relationships, 
    class_name: :BoardPin,
    foreign_key: :pin_id,
    dependent: :destroy

    has_many :pin_user_relationships, 
    class_name: :PinsUser,
    foreign_key: :pin_id,
    dependent: :destroy

    has_one :pin_creator_relationship, 
    -> { where(created_pin: true) },
    class_name: :PinsUser,
    foreign_key: :pin_id

    has_one :creator,
    through: :pin_creator_relationship,
    source: :user

    has_many :boards, # boards that saved this pin
    through: :board_to_pin_relationships, 
    source: :board

    has_many :comments, dependent: :destroy

    def ensure_image
      unless self.image.attached?
        errors[:image] << "must be attached"
      end
    end

    def self.generate_random_pins(num)
      pins = []
      num.to_i.times do |i| 
        offset = rand(Pin.count)
        pins.push(Pin.offset(offset).first)
      end
      return pins
    end

    def self.safe_create(pin_params, user_id)
      pin = Pin.new(pin_params)
    
      Pin.transaction do
        if pin.save!
            pins_user = PinsUser.new({
                user_id: user_id,
                pin_id: pin.id,
                created_pin: true,
                saved_pin: false
            })
            if pins_user.save!
                return [pin, "success"]
            else
              return [pin, pins_user.errors.full_messages]
            end
        else
          return [pin, pin.errors.full_messages]
        end
      end

      return [pin, "Bad params"]
    end

    def safe_create(user_id)
      Pin.transaction do
        if self.save!
            pins_user = PinsUser.new({
                user_id: user_id,
                pin_id: self.id,
                created_pin: true,
                saved_pin: false
            })
            if pins_user.save!
                return "success"
            else
              return pins_user.errors.full_messages
            end
        else
          return self.errors.full_messages
        end
      end

      return "Bad params"
    end

    def self.find_pins_by_ids(pin_ids)
      return if pin_ids.nil? || pin_ids.empty? 

      Pin.with_attached_image
         .select("pins.*")
         .where(["pins.id in (?)", pin_ids])
    end
  
    
end
