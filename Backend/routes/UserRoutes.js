const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");

const {
  ResgisterAdmin,
  ResgiterUser,
  GetallAdmin,
  DeleteAdmin,
  GetallUsers,
  DeleteAnyUser,
  BanAdmin,
  UnbanAdmin,
  UnbanUser,
  BanUser,
  createGroup,
  removeUsersFromGroup,
  addUsersToGroup,
  GetallGroupsList,
  AssignGroupsToAdmin,
  CreateLiveSession,
  GetLivesessionByGroupId,
  GetLiveSessionByUserId,
  AddFeedBack,
  GetFeedbacklist,
  GetGroupListOfAdmin,
  GetGroupListOfUser,
  GetChatHistory,
  GetGroupInfo,
  GetAllFeedbacks,
  GetRoomsofAnyUser,
  GetRoomsofAnyGroup,
  GetallRooms,
  GetBanHistory,
  Createroom,
  getUserProfile
} = require("../Controller/SuperadminController");


router.get('/profile/:userId',auth, getUserProfile);
router.post("/adminregister", auth, role(["SuperAdmin"]), ResgisterAdmin);
router.post("/userresgister", ResgiterUser);
router.get("/getalladmin", auth, role(["SuperAdmin", "Admin"]), GetallAdmin);
router.put(
  "/deleteadmin/:customer_ref_no",
  auth,
  role(["SuperAdmin", "Admin"]),
  DeleteAdmin
);
router.get("/alluserlist", auth, role(["SuperAdmin", "Admin"]), GetallUsers);
router.put(
  "/deleteuser/:customer_ref_no",
  auth,
  role(["SuperAdmin", "Admin"]),
  DeleteAnyUser
);
router.put("/banadmin/:customer_ref_no", auth, role(["SuperAdmin"]), BanAdmin);
router.put(
  "/unbanadmin/:customer_ref_no",
  auth,
  role(["SuperAdmin"]),
  UnbanAdmin
);
router.put("/userban/:customer_ref_no", auth, role(["SuperAdmin"]), BanUser);
router.put(
  "/unbanuser/:customer_ref_no",
  auth,
  role(["SuperAdmin"]),
  UnbanUser
);

// ban hoistory routes
router.get("/adminbanhistory/:customer_ref_no", GetBanHistory);

// group routes

router.post("/create-group", auth, role(["SuperAdmin", "Admin"]), createGroup);
router.get("/grouplist", GetallGroupsList);
router.put("/add-users/:groupId", addUsersToGroup);
router.put("/remove-user/:groupId", removeUsersFromGroup);
router.post(
  "/assigngroup/:adminId",
  auth,
  role(["SuperAdmin"]),
  AssignGroupsToAdmin
);
router.get("/admingroups", auth, GetGroupListOfAdmin);
router.get("/getusergroup", auth, GetGroupListOfUser);
router.get("/room/:roomId", auth, GetGroupInfo);

// live session and chat routes

router.post(
  "/createlivesession",
  auth,
  role(["SuperAdmin", "Admin"]),
  CreateLiveSession
);
router.get("/getlivesession/:groupId", GetLivesessionByGroupId);
router.get("/livesession-userId/:customerRef_no", GetLiveSessionByUserId);
router.get("/chat-history/:roomId", auth, GetChatHistory);

// feedback routes

router.post("/submitfeedback", auth, AddFeedBack);
router.get(
  "/getfeedbacks/type/:type/date/:date/user/:userId",
  auth,
  role(["SuperAdmin", "Admin"]),
  GetFeedbacklist
);
router.get("/feedbacks", auth, role(["SuperAdmin"]), GetAllFeedbacks);

// room routes

router.post("/createroom",  Createroom);
router.get("/room-group/:groupId", GetRoomsofAnyGroup);

module.exports = router;
