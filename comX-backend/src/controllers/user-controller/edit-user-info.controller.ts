import { Request, Response } from "express";
import { prisma } from "../../config/dbConnect";
import { SocialLinks } from "@prisma/client"; // Import SocialLinks from Prisma client
import { responseCodes } from "../../utils/response-codes";
import { uploadOnCloudinary } from "../../utils/cloudinary";
import fs from "fs";

export const edit_user_info = async (req: Request, res: Response) => {
  try {
    const { username } = req.params;

    // Extract fields to update
    const {
      designation,
      bio,
      location,
      website,
      phone,
      skills,
      socialLinks,
    } = req.body;

    // Validation: Ensure all required fields are valid
    if (!username) {
      return responseCodes.clientError.badRequest(res, "Username is required");
    }

    if (designation && typeof designation !== "string") {
      return responseCodes.clientError.badRequest(res, "Invalid designation");
    }

    if (bio && typeof bio !== "string") {
      return responseCodes.clientError.badRequest(res, "Invalid bio");
    }

    if (location && typeof location !== "string") {
      return responseCodes.clientError.badRequest(res, "Invalid location");
    }

    if (website && typeof website !== "string") {
      return responseCodes.clientError.badRequest(res, "Invalid website URL");
    }

    if (phone && !/^\+?[1-9]\d{1,14}$/.test(phone)) {
      return responseCodes.clientError.badRequest(
        res,
        "Invalid phone number format"
      );
    }

    if (skills && !Array.isArray(skills)) {
      return responseCodes.clientError.badRequest(res, "Skills must be an array");
    }

    if (socialLinks) {
      // Validate socialLinks against the SocialLinks enum
      const isValidSocialLinks = Array.isArray(socialLinks)
        ? socialLinks.every((link: string) =>
            Object.values(SocialLinks).includes(link as SocialLinks)
          )
        : false;

      if (!isValidSocialLinks) {
        return responseCodes.clientError.badRequest(
          res,
          `Invalid social links. Allowed values: ${Object.values(SocialLinks).join(", ")}`
        );
      }
    }

    // Check if user exists
    const user = await prisma.user.findFirst({
      where: { username },
    });

    if (!user) {
      return responseCodes.clientError.notFound(res, "User not found");
    }

    // Prepare update data object
    const updateData: any = {
      designation,
      bio,
      location,
      website,
      phone,
      skills,
    };

    let coverImageUrl = null;
        if(req.file){
            const localFilePath = req.file.path;
            const cloudinaryResult = await uploadOnCloudinary(localFilePath);

            if(!cloudinaryResult){
                return responseCodes.serverError.internalServerError(res, "cloudinary upload failed");
            }
            
            coverImageUrl = cloudinaryResult.url;
            fs.unlinkSync(localFilePath);
        }
      
    if(coverImageUrl){
      updateData.avatar = coverImageUrl;
    }

    if (socialLinks) {
      updateData.socialLinks = socialLinks; // Directly assign validated socialLinks
    }

    // Update user information
    const updatedUser = await prisma.user.update({
      where: { username },
      data: updateData,
      select: {
        name: true,
        email: true,
        avatar: true,
        username: true,
        designation: true,
        bio: true,
        location: true,
        website: true,
        phone: true,
        skills: true,
        socialLinks: true,
      },
    });

    return responseCodes.success.ok(
      res,
      updatedUser
    );
  } catch (e) {
    console.error(e);
    return responseCodes.serverError.internalServerError(
      res,
      "Internal server error"
    );
  }
};
