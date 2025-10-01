enum ProfileRole {
    ADMIN = 'admin',
    STUDENT = 'student',
    TEACHER = 'teacher',
    GUEST = 'guest'
}

namespace ProfileRole {
    // Check if string is a valid enum value
    export function isValid(value: string): boolean {
        return Object.values(ProfileRole).some((val) => 
            typeof val === 'string' && val === value
        );
    }

    export function fromString(value: string): ProfileRole | undefined {
        if (isValid(value)) {
            return value as ProfileRole;
        }
        return undefined;
    }

    export function fromStringIgnoreCase(value: string): ProfileRole | undefined {
        const normalizedValue = value.toLowerCase();
        const matchingValue = Object.values(ProfileRole).find(
            enumValue => typeof enumValue === 'string' && enumValue.toLowerCase() === normalizedValue
        );
        return matchingValue as ProfileRole | undefined;
    }
}

export default ProfileRole;