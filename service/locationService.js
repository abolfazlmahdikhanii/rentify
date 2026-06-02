import axios from "axios";

export default class PropertyLocationService {
  static API_KEY = process.env.NESHAN_API_KEY;

  static IMPORTANT_TYPES = {
    metro: "ایستگاه مترو",
    hospital: "بیمارستان",
    school: "مدرسه",
    pharmacy: "داروخانه",
    park: "پارک",
    mall: "مرکز خرید",
  };

  static async getPropertyLocationData(lat, lng) {
    const [address, nearby] = await Promise.all([
      this.reverseGeocode(lat, lng),
      this.getNearbyPlaces(lat, lng),
    ]);

    return {
      success: true,
      address,
      nearby,
      createdAt: new Date().toISOString(),
    };
  }

  static async reverseGeocode(lat, lng) {
    try {
      const { data } = await axios.get("https://api.neshan.org/v5/reverse", {
        params: { lat, lng },
        headers: {
          "Api-Key": this.API_KEY,
        },
      });

      return {
        province: data.province,
        city: data.city,
        district: data.district,
        neighbourhood: data.neighbourhood,
        address: data.formatted_address,
      };
    } catch (error) {
      return null;
    }
  }

  static async getNearbyPlaces(lat, lng) {
    const searches = Object.entries(this.IMPORTANT_TYPES).map(([key, term]) =>
      this.searchNearestPlace(lat, lng, key, term),
    );

    const results = await Promise.all(searches);

    return results.reduce((acc, item) => {
      acc[item.type] = item.place;
      return acc;
    }, {});
  }

  static async searchNearestPlace(lat, lng, type, term) {
    try {
      const { data } = await axios.get("https://api.neshan.org/v1/search", {
        params: {
          term,
          lat,
          lng,
        },
        headers: {
          "Api-Key": this.API_KEY,
        },
      });

      if (!data.items || data.items.length === 0) {
        return {
          type,
          place: null,
        };
      }

      const nearest = data.items[0];

      return {
        type,
        place: {
          name: nearest.title,
          address: nearest.address,
          lat: nearest.location?.y,
          lng: nearest.location?.x,
        },
      };
    } catch {
      return {
        type,
        place: null,
      };
    }
  }
}
