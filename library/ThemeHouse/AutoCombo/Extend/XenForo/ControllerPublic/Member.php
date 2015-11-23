<?php

class ThemeHouse_AutoCombo_Extend_XenForo_ControllerPublic_Member extends XFCP_ThemeHouse_AutoCombo_Extend_XenForo_ControllerPublic_Member
{

    public function actionFindAutoCombo()
    {
        $q = $this->_input->filterSingle('q', XenForo_Input::STRING);

        $conditions = array(
            'user_state' => 'valid',
            'is_banned' => 0
        );
        if ($q)
            $conditions['username'] = array(
                $q,
                'r'
            );
        $users = $this->_getUserModel()->getUsers($conditions);

        $viewParams = array(
            'users' => $users
        );

        return $this->responseView('XenForo_ViewPublic_Member_Find', 'member_autocomplete', $viewParams);
    } /* END actionFindAutoCombo */
}