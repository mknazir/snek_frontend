let bottomNavigationRef = { setIndex: null, routes: [], roomId: null };

export const setBottomNavigationRef = (setIndex, routes, roomId) => {
  bottomNavigationRef.setIndex = setIndex;
  bottomNavigationRef.routes = routes;
  bottomNavigationRef.roomId = roomId;
};

export const navigateToTab = (tabName, roomId) => {
    if (bottomNavigationRef.setIndex && bottomNavigationRef.routes.length > 0) {
      const tabIndex = bottomNavigationRef.routes.findIndex(
        (route) => route.key === tabName
      );
      if (tabIndex !== -1) {
        bottomNavigationRef.setIndex(tabIndex);
        if (roomId) {
          bottomNavigationRef.roomId = roomId;
        }
      }
    }
  };
  

export const getRoomId = () => bottomNavigationRef.roomId;

export const clearRoomId = () => {
  bottomNavigationRef.roomId = null;
};